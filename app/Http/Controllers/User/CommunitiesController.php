<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Community; 
use App\Models\CommunityMember; 
use App\Models\CommunityRequest; 
use App\Models\CommunityPost; 
use App\Models\CommunityWorkfolio; 
use App\Models\CommunityProblem; 
use App\Models\CommunityJob; 
use App\Models\CommunityFreelance; 
use App\Models\CommunityMessage; 


use App\Events\CommunityMemberCountEvent;
use App\Events\CommunitySendRequestEvent;
use App\Events\CommunityLeaveEvent;
use App\Events\CommunityJoinEvent;
use App\Events\CommunityJoinedRequestCancelEvent;
use App\Events\CommunityRequestCountEvent;
use App\Events\CommunityRemoveMemberEvent;
use App\Events\CommunityAcceptRequestEvent;
use App\Events\CommunityRejectRequestEvent;
use App\Events\CommunityRequestCancelEvent;

use JWTAuth;
use Exception;

class CommunitiesController extends Controller
{
    
		//functiopn to  fetching communities created by  logged user or other selected user
		function getUserCommunities(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$communityList = Community::select('id', 'name',  'created_by', 'image' )
					->where('created_by', $user->id) 
					->withCount('members')
					->withCount(['requests as pending_requests_count' => function ($query) {
            $query->where('status', 'pending'); // Adjust the status value as per your logic
					}])
					->orderBy('id', 'desc') 
					->cursorPaginate(10);
					
					// Convert image paths to full URLs
         foreach ($communityList as $community) {
            $community->image = $community->image
                ? url(Storage::url('community_profile_image/' . $community->image))  
                : null;
        } 
					
					$data = ['status' => true,'message'=> 'Community list is ready.', 'communityList'=> $communityList,  ]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//functiopn to  fetching joined communities 
		function getJoinedCommunities(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$communityList = Community::select('id', 'name',  'created_by', 'image' ) 
					->whereHas('members', function ($query) use ($user) {
                // Filter jobs that the user has applied for
                $query->where('user_id', $user->id)->whereNot('role', 'admin');
            })
					->withCount('members')
					->withExists(['members as has_joined' => function ($query) use ($user) {
						$query->where('user_id', $user->id)->whereNot('role', 'admin');
					}])  
					->orderBy('id', 'desc') 
					->cursorPaginate(10);
					         
					// Convert image paths to full URLs
					 foreach ($communityList as $community) {
							$community->image = $community->image
									? url(Storage::url('community_profile_image/' . $community->image))  
									: null;
					} 
					
					
					
					$data = ['status' => true,'message'=> 'Joined Community list is ready.', 'communityList'=> $communityList ]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//functiopn to  fetching  suggestion communities 
		function getSuggestionCommunities(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$followingIds = $user->following()->pluck('following_id');
				
					$userInterests = $user->customer->interest ?? [];  // Get user's interests (stored as JSON)
				
					$communityList = Community::select('id', 'name',  'created_by', 'privacy', 'image' )  
					->whereNot('created_by',  $user->id)
					->where(function ($query) use ($userInterests, $followingIds) {
						if (!empty($userInterests)) {
							foreach ($userInterests as $interest) { 
								 $query->orWhere('name', 'LIKE', "%$interest%");
							}
						}

						if (!$followingIds->isEmpty()) {
							$query->orWhereIn('created_by', $followingIds);
						}
					})
					->with([
						'requests'=> function ($query) use ($user) {
									$query->where('user_id', $user->id)
											 ->select('id','community_id','status'); 
							}		
					])
					->withCount('members')
					->withExists(['members as has_joined' => function ($query) use ($user) {
						$query->where('user_id', $user->id)->whereNot('role', 'admin');
					}]) 
					->orderBy('id', 'desc') 
					->cursorPaginate(10);
					
					// Convert image paths to full URLs
					foreach ($communityList as $community) {
            $community->image = $community->image
                ? url(Storage::url('community_profile_image/' . $community->image))  
                : null;
					} 
					
					
					
					
					$data = ['status' => true,'message'=> 'Suggestion Community list is ready.', 'communityList'=> $communityList ]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		//function for joining the community
		function joinCommunity(Request $request)
		{
			try
			{
					// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					 
					 $community = Community::select('id', 'name', 'created_by', 'privacy', 'image', 'content_share_access')
					 ->findOrFail($request->id);
					 
					  
					//getting full path of image
           $community->image = $community->image
                ? url(Storage::url('community_profile_image/' . $community->image))  
                : null;
        
					
					
					 // Check if it's a private community 
					if ($community->privacy === 'private') {
							return response()->json(['status' => false, 'message' => 'This is a private community. Send a request instead.']);
					}
					
					
					// Check if user is already a member
					if (CommunityMember::where('user_id', $user->id)->where('community_id', $request->id)->exists()) {
							return response()->json(['status' => false, 'message' => 'You are already a member of this community.']);
					}
					
					// Determine if the user can share content
					$canShare = $community->content_share_access === 'everyone';

					$newCommunityMember = CommunityMember::create([
            'user_id' => $user->id,
            'community_id' => $request->id,
            'role' => 'member',
            'can_share_content' => $canShare,
					]);
					
					 
					$newCommunityMember->load([
						'user:id,userID',
						'user.customer:id,user_id,image',
					]);
					
					//getting full path of image
           $newCommunityMember->user->customer->image = $newCommunityMember->user->customer->image
                ? url(Storage::url('profile_image/' . $newCommunityMember->user->customer->image)) : null;
        
				
				
					$community->loadCount('members');
					$community->has_joined = true;
					/*$community->loadExists(['members as has_joined' => function ($query) use ($user) {
							$query->where('user_id', $user->id)->whereNot('role', 'admin');
							}]);*/
					
					$newMemberData = (object)$newCommunityMember->only(['id','community_id', 'user_id', 'role', 'can_share_content','user']);
					
					//Dispatching event
					CommunityMemberCountEvent::dispatch( 
						['community_id' => $community->id, 'user_id'=>$user->id, 'members_count' =>$community->members_count ]
					); 
					CommunityJoinEvent::dispatch( 
						$newMemberData
					); 
				
				   
                    
					$data = 
					[
						'status' => true,
						'message'=> 'Joined community successfully.',
						'communityData' =>$community->only(['id', 'name', 'created_by', 'image', 'members_count', 'has_joined'])
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	


	//function for request the community
		function requestCommunity(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					// Check if user is already a member
					if (CommunityMember::where('user_id', $user->id)
						->where('community_id', $request->id)
						->exists()) 
					{
							return response()->json(['status' => false, 'message' => 'You are already a member of this community.']);
					}
					
					
					// Check if any request exists
					$existingRequest = CommunityRequest::where('user_id', $user->id)
							->where('community_id', $request->id)
							->first();

					if ($existingRequest) {
							if ($existingRequest->status === 'pending') {
									// If request is already pending, cancel (delete) it
									$existingRequest->delete();
								
									// count pending request for perticular community
									$CommunityPendingRequestCount = CommunityRequest::where('community_id', $request->id)
										->where('status', 'pending')->count();
									// count  request for perticular community
									$CommunityRequestCount = CommunityRequest::where('community_id', $request->id)->count();

									//Dispatching event
									CommunityJoinedRequestCancelEvent::dispatch( 
										[	
											'community_id' => $existingRequest->community_id, 
											'request_id' => $existingRequest->id, 
											'user_id'=>$user->id,  
										]
									);
									CommunityRequestCountEvent::dispatch( 
										[	
											'community_id' => $existingRequest->community_id,  
											'user_id'=>$user->id,  
											'pending_requests_count'=>$CommunityPendingRequestCount,  
											'requests_count'=>$CommunityRequestCount,  
										]
									); 
					
									
									return response()->json([
											'status' => true,
											'message' => 'Request canceled successfully.',
											'canceledRequest' => true
									]);
							} elseif (in_array($existingRequest->status, ['accepted', 'rejected'])) {
									// If request is accepted or rejected, do not allow creating a new request
									return response()->json([
											'status' => false,
											'message' => "You cannot send another request. Your previous request was {$existingRequest->status}."
									]);
							}
					}

					
					$newRequest = CommunityRequest::create([
            'user_id' => $user->id,
            'community_id' => $request->id,
            'status' => 'pending'
					]);
					
					$newRequest->load(['user:id,userID',
															'user.customer:id,user_id,image'	
														]);
					 
					
				//getting full url of profile image of user
				if (!filter_var($newRequest->user->customer->image, FILTER_VALIDATE_URL))  
				{
					$newRequest->user->customer->image = $newRequest->user->customer->image
							? url(Storage::url('profile_image/' . $newRequest->user->customer->image))  
							: null;
				}		
					 
					// count pending request for perticular community
					$CommunityPendingRequestCount = CommunityRequest::where('community_id', $request->id)
						->where('status', 'pending')->count();
					// count  request for perticular community
					$CommunityRequestCount = CommunityRequest::where('community_id', $request->id)->count();


					//Dispatching event
					CommunitySendRequestEvent::dispatch( 
						 (object)$newRequest->only(['id','community_id','user_id', 'status','user' ]) 
					); 
					CommunityRequestCountEvent::dispatch( 
						[	
							'community_id' => $request->id, 
							'user_id'=>$user->id,  
							'pending_requests_count'=>$CommunityPendingRequestCount,  
							'requests_count'=>$CommunityRequestCount,  
						]
					); 
					
					$data = [
						'status' => true,
						'message'=> 'Request sent successfully.' ,
						'newRequest' => (object)$newRequest->only(['id','community_id','status' ]) ,
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for leave the community
		function leaveCommunity(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$membership = CommunityMember::where('user_id', $user->id)->where('community_id', $request->id)->whereNot('role', 'admin')->first();

					if (!$membership) {
							return response()->json(['status' => false, 'message' => 'You are not a member of this community.']);
					}
					$member_id = $membership->id;
					// Remove user from the community
					$membership->delete();
					
					$community_members_count = CommunityMember::where('community_id', $request->id)->count();
					
					//Dispatching event
					CommunityMemberCountEvent::dispatch( 
						['community_id' => $request->id, 'user_id'=>$user->id, 'members_count' =>$community_members_count]
					); 
					CommunityLeaveEvent::dispatch( 
						['community_id' => $request->id, 'user_id'=>$user->id, 'member_id' =>$member_id]
					);
					
					
					$data = [
					'status' => true,
					'message'=> 'Left community successfully.', 
					'members_count'=>$community_members_count
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for create new community
		function createNewCommunity(Request $request)
		{
			// Validate the incoming data
			$request->validate([ 
						'name' => 'required|string',
						'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:5120',
						'privacy' => 'in:public,private',
            'content_share_access' => 'in:everyone,selected',
            'description' => 'nullable|string',
			]);
      
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$newCommunity= new Community();
					$newCommunity->name = $request->name; 
					$newCommunity->created_by = $user->id; 
					$newCommunity->privacy = $request->privacy; 
					$newCommunity->content_share_access = $request->content_share_access; 
					$newCommunity->description = $request->description;  
					$newCommunity->save();
					
					$imageFileName = null;
					if ($request->hasFile('image')) 
					{ 
						$imageFileName =  'community_profile_image_'.$newCommunity->id.'.'.$request->image->extension();
						//$request->image->move(public_path('community_profile_image/'), $imageFileName); 
						$request->file('image')->storeAs('community_profile_image', $imageFileName, 'public');

					
					}
					
					$newCommunity->image = $imageFileName;
					$newCommunity->save();
					
					// Convert image paths to full URLs
					 $newCommunity->image = $newCommunity->image
									? url(Storage::url('community_profile_image/' . $newCommunity->image))  
									: null;
					 
					
					// Assign the creator as an admin member of the community
						$communityMember = new CommunityMember();
						$communityMember->community_id = $newCommunity->id;
						$communityMember->user_id = $user->id;
						$communityMember->role = 'admin'; // Assigning role as admin
						$communityMember->can_share_content = true; // Admins can share content
						$communityMember->save();
					
					$newCommunity->loadCount('members');
					$newCommunity->loadCount(['requests as pending_requests_count' => function ($query) {
            $query->where('status', 'pending');  
					}]);
					
					
					 
					
					$data = [
						'status' => true,
						'message'=> 'Community  is createed successfully.', 
						'newCommunity'=>(object)$newCommunity->only(['id', 'name',  'created_by', 'image','members_count','pending_requests_count' ])
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	


		//function for delete community
		function deleteComunity(Request $request)
		{
			// Validate the incoming data
			 
      
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					if (!$request->has('communityId')) {
            return response()->json(['status' => false, 'message' => 'Community ID is required.'], 400);
					}
				
					$communityId = $request->communityId;
					
					//find community first
					$community = Community::findOrFail($communityId); 
				 
					//community profile image
					if(!empty($community->image)) 
					{
							$imagePath = 'community_profile_image/' . $community->image;
							if (Storage::disk('public')->exists($imagePath)) {  
                Storage::disk('public')->delete($imagePath);
							}
							
					}
					 
					//fetching chat message of community  
					 $messages = CommunityMessage::where('community_id', $communityId)->get();

					foreach ($messages as $message) {
							// Check if message has an attachment
							if (!empty($message->attachment)) {
									$attachmentPath = 'community_message_attachment/' . $message->attachment;

									if (Storage::disk('public')->exists($attachmentPath)) {
											Storage::disk('public')->delete($attachmentPath);
									}
							}

							 
					}	
						
					// Delete the assignment
          $community->delete(); 
					
					$data = [
						'status' => true,
						'message'=> 'Community  has been  deleted successfully.',  
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for update community image
		function updateCommunityImage(Request $request)
		{
			// Validate the incoming data
			 $request->validate([ 
						 
						'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:5120',
						'communityId' => 'required',
             
			]);
      
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					 
					$communityId = $request->communityId;
					 
					
					//find community first
					$community = Community::findOrFail($communityId); 
					
					// Check if an image is uploaded
					if (!$request->hasFile('image')) {
            return response()->json(['status' => false, 'message' => 'No image uploaded.'], 400);
					}
					
					// Delete old image if exists
					if(!empty($community->image)) 
					{ 
							$imagePath = 'community_profile_image/' . $community->image;
							if (Storage::disk('public')->exists($imagePath)) {  
                Storage::disk('public')->delete($imagePath);
							}
					}
					  
					 
					$imageFileName =  'community_profile_image_'.$community->id.'.'.$request->image->extension();
					//$request->image->move(public_path('community_profile_image/'), $imageFileName); 
					$request->file('image')->storeAs('community_profile_image', $imageFileName, 'public');

					 
					
					$community->image = $imageFileName;
					$community->save(); 
					
					// Generate full image URL dynamically based on storage disk
					 $community->image = $community->image
            ? url(Storage::url('community_profile_image/' . $community->image)) 
            : null;
						
						
					$data = [
						'status' => true,
						'message'=> 'Community image has been  updated successfully.',
						'image'=>$community->image
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for update community detail
		function updateCommunityDetail(Request $request)
		{
			// Validate the incoming data
			 $request->validate([ 
						'name' => 'required|string', 
						'privacy' => 'in:public,private',
            'content_share_access' => 'in:everyone,selected',
            'description' => 'nullable|string',
						'community_id' => 'required',
             
			]);
      
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					 
				
					$communityId = $request->community_id;
					 
					
					//find community first
					$community = Community::findOrFail($communityId); 
					 
					$community->name = $request->name;
					$community->privacy = $request->privacy;
					$community->content_share_access = $request->content_share_access;
					$community->description = $request->description;
					
					$community->save(); 
					
					$data = [
						'status' => true,
						'message'=> 'Community detail has been  updated successfully.',
						 
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		
		//function for fetching community detail
		function getCommunityDetail(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					$communityId = $request->communityId;
					
					$communityDetail = Community::select(['id', 'name', 'description', 'privacy', 'created_by', 'content_share_access', 'image']) 
					->findOrFail($communityId);
					 
					$communityDetail->loadCount(['members']);
					
					if($communityDetail->created_by == $user->id)
					{
						$communityDetail->loadCount(['requests']);
						
					}
					else
					{
						$communityDetail->load([
						'creator:id,userID', 
						'requests'=> function ($query) use ($user) {
									$query->where('user_id', $user->id)
											 ->select('id','community_id','status'); 
							}		
						]);
						$communityDetail->loadExists(['members as has_joined' => function ($query) use ($user) {
							$query->where('user_id', $user->id)->whereNot('role', 'admin');
							}]);
						 
					}
					
					
					// Generate full image URL dynamically based on storage disk
					 $communityDetail->image = $communityDetail->image
            ? url(Storage::url('community_profile_image/' . $communityDetail->image)) 
            : null;
						
						
					$data = [
						'status' => true,
						'message'=> 'Community  detail is  ready.', 
						'communityDetail' => $communityDetail
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		//function for fetching community member
		function getCommunityMembers(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$communityId = $request->community_id;
				
				$communityOwner = null;
				if($request->getCommunityOwner)
				{
					$communityOwner = Community::where('id', $communityId)->value('created_by');
				}
				
				$memberList = CommunityMember::select(['id','community_id', 'user_id', 'role', 'can_share_content'])
				->with([
					'user:id,userID',
					'user.customer:id,user_id,image',
				])
				->where('community_id',$communityId)  
				->orderBy('id', 'asc')  
				->orderBy('role', 'desc')  
				->cursorPaginate(20);
				 
				// Convert image paths to full URLs
				foreach ($memberList as $member) 
				{
					if($member->user->customer != null && !filter_var($member->user->customer->image, FILTER_VALIDATE_URL)) 
					{
            $member->user->customer->image = $member->user->customer->image
                ? url(Storage::url('profile_image/' . $member->user->customer->image))  
                : null;
					}
        } 
				 
					 
				$data = [
					'status' => true,
					'message'=> 'Community  member list is  ready.', 
					'memberList'=> $memberList,
					'communityOwner'=> $communityOwner,
				]; 
					
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for community member Role Updation 
	/*	function memberRoleUpdation(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$memberId = $request->memberId;
				$role = $request->role;
				
			 
				$member = CommunityMember:: findOrFail($memberId);
				
				// Update the role
        $member->role = $role;
        $member->save();
				 
				$data = [
					'status' => true,
					'message'=> 'Member role updated successfully.', 
					 
				]; 
					
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		*/
		
		//function for community member content share access  Updation 
		function memberContentShareAccessUpdation(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$memberId = $request->memberId;
				$access = $request->access;
				
			 
				$member = CommunityMember:: findOrFail($memberId);
				
				// Update the role
        $member->can_share_content = $access;
        $member->save();
				 
				$data = [
					'status' => true,
					'message'=> 'Sharing access is updated successfully.', 
					 
				]; 
					
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for community member remove 
		function removeCommunityMember(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$memberId = $request->memberId;
				 
			 
				$member = CommunityMember:: findOrFail($memberId);
				$member_user_id = $member->user_id;
				 // Ensure only the community owner or an admin can remove members
        $community = Community::findOrFail($member->community_id);

        if ($user->id !== $community->created_by ) {
            return response()->json([
                'status' => false,
                'message' => 'You do not have permission to remove this member.',
            ], 403);
        }

        // Prevent the community owner from being removed
        if ($member->user_id == $community->created_by) {
            return response()->json([
                'status' => false,
                'message' => 'The community owner cannot be removed.',
            ], 400);
        }

        // Delete the member
        $member->delete();
				
				//count members if community
			 $community->loadCount('members');
				
				//Dispatching event
				CommunityMemberCountEvent::dispatch( 
					['community_id' => $community->id, 'user_id'=>$user->id, 'members_count' =>$community->members_count]
				); 
				CommunityRemoveMemberEvent::dispatch( 
					[
						'community_id' => $community->id, 
						'user_id'=>$user->id,
						'member_id' =>$memberId,
						'member_user_id' =>$member_user_id
					]
				);  
					 
					 
				$data = [
					'status' => true,
					'message' => 'Community member removed successfully.',
					 'members_count' =>$community->members_count
				]; 
					
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		
		//function for fetching community request
		function getCommunityRequest(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$communityId = $request->community_id;
				
			 
				
				$requestList = CommunityRequest::select(['id','community_id', 'user_id', 'status'])
				->with([
					'user:id,userID',
					'user.customer:id,user_id,image',
				])
				->where('community_id',$communityId)  
				->orderBy('id', 'desc')   
				->cursorPaginate(20);
				 
				// Convert image paths to full URLs
				foreach ($requestList as $req) {
            $req->user->customer->image = $req->user->customer->image
                ? url(Storage::url('profile_image/' . $req->user->customer->image))  
                : null;
        } 
				 
				$data = [
					'status' => true,
					'message'=> 'Community  request list is  ready.', 
					'requestList'=> $requestList,
					 
				]; 
				
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	


	//function for request Status Updation
		function requestStatusUpdation(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate(); 
				$requestId = $request->requestId;
				$status = $request->status;
				
			 
				 // Find the request
        $communityRequest = CommunityRequest::findOrFail($requestId);
				$request_by_user_id = $communityRequest->user_id;
				
				// Get community details
				$community = Community::findOrFail($communityRequest->community_id);
 
				// Handle cancellation
        if ($status === 'canceled') {
            
            $communityRequest->delete();
						$requests_count = $community->requests()->count();
						
						//Dispatching event
						CommunityRequestCancelEvent::dispatch( 
							[
								'community_id' => $community->id,
								'user_id'=>$user->id, 
								'request_by_user_id'=>$request_by_user_id   
							]
						);
						
            return response()->json(['status' => true, 'message' => 'Request has been canceled successfully.', 'requests_count' => $requests_count]);
        }
				
				 // Handle rejection
        if ($status == 'rejected') {
            $communityRequest->status = 'rejected';
            $communityRequest->save();
						
						$requests_count = $community->requests()->count();
						
						//Dispatching event
						CommunityRejectRequestEvent::dispatch( 
							[
								'community_id' => $community->id,
								'user_id'=>$user->id, 
								'request_by_user_id'=>$request_by_user_id, 
								'request_id' =>$requestId,
								'status' =>$communityRequest->status,
							]
						);
 
            return response()->json(['status' => true, 'message' => 'Request has been rejected successfully.','requests_count' => $requests_count-1]);
        }
				
				// Handle acceptance
			  if($status == 'accepted')
				{
					// Check if user is already a member
					if (CommunityMember::where('user_id', $communityRequest->user_id)
						->where('community_id', $communityRequest->community_id)
						->exists()) 
					{
							return response()->json(['status' => false, 'message' => 'This user is already a member of this community.']);
					}
					
					
					// Determine if the user can share content
					$canShare = $community->content_share_access === 'everyone';

					$newCommunityMember = CommunityMember::create([
            'user_id' => $communityRequest->user_id,
            'community_id' => $communityRequest->community_id,
            'role' => 'member',
            'can_share_content' => $canShare,
					]);
					
				 // Delete request
					$communityRequest->delete();
					
					$community->loadCount(['members','requests']); 
					$community->has_joined = true;
					
					 
					$community->image = $community->image
                ? url(Storage::url('community_profile_image/' . $community->image))  
                : null;
					
					
					//Dispatching event
					CommunityMemberCountEvent::dispatch( 
						['community_id' => $community->id, 'user_id'=>$user->id, 'members_count' =>$community->members_count]
					);
					CommunityAcceptRequestEvent::dispatch( 
						[
							'user_id'=>$user->id,
							'member_user_id'=>$newCommunityMember->user_id,
							'communityData' =>(object)$community->only(['id', 'name',  'created_by', 'image','members_count','has_joined'])
						]
					);
					
					
					return response()->json(
						[
						'status' => true,
						'message' => 'User has been added as a member successfully.',
						'requests_count' => $community->requests_count,
						'members_count' => $community->members_count
						]
					);
        }

        return response()->json(['status' => false, 'message' => 'Invalid status provided.']);

				 
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
	

 
	



	//function for fetching community posts
		function getCommunityPosts(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				$communityId = $request->communityId;
				
				$communityPosts = CommunityPost::where('community_id', $communityId)
					->with([
                'post' => function ($query) use ($user) {
                    $query->select('id',  'attachment', 'created_at')
                        ->withCount('likes', 'comments') // Get counts for likes and comments
                        ->withExists(['likes as has_liked' => function ($query) use ($user) {
                            $query->where('user_id', $user->id);
                        }])
                        ->withExists(['saves as has_saved' => function ($query) use ($user) {
                            $query->where('user_id', $user->id);
                        }]);
                },
								'sender:id,userID',
								'sender.customer:id,user_id,image',
            ])
					->orderBy('id', 'desc')
					->cursorPaginate(10);		
					
					
								
					 // Extract only the post objects into an array
					$postsArray = [];
 
					foreach ($communityPosts as $communityPost) {
							if ($communityPost->post) {
									$post = $communityPost->post;
									
									// Convert image paths to full URLs
									
									$fileExtension = !empty($post->attachment) && isset($post->attachment[0])  && is_string($post->attachment[0]) 
										? pathinfo($post->attachment[0], PATHINFO_EXTENSION) 
										: null;

									
									if($fileExtension == null)
									{
										$post->attachment = null;
									}
									else 
									{
									 
										if($fileExtension == 'mp4')
										{
											$folderName = 'post_video_thumbnail';
											$thumbnailFileName = pathinfo($post->attachment[0], PATHINFO_FILENAME) . '.png';
											$post->attachment = url(Storage::url($folderName . '/' . $thumbnailFileName));											
										}
										else
										{
											$folderName = 'post_image'; 
											$post->attachment = $post->attachment[0]
											? url(Storage::url($folderName .'/' . $post->attachment[0]))  
											: null;
										}
										
									}
								
									//get sender
									$post->sender = $communityPost->sender; 
									//getting full profile image url of sender
									$post->sender->customer->image = $post->sender->customer->image
									? url(Storage::url('profile_image/' . $post->sender->customer->image))  
									: null;
									
									
									$postsArray[] = $post;
							}
					}
					
					$nextCursor = $communityPosts->nextCursor();
					$prevCursor = $communityPosts->previousCursor();
				
					$data = [
						'status' => true,
						'message'=> 'Community  post list is  ready.', 
						'postList' => [
                'data' => $postsArray,
                'next_cursor' => $nextCursor ? $nextCursor->encode() : null,
                'next_page_url' => $communityPosts->nextPageUrl(),
                'prev_cursor' => $prevCursor ? $prevCursor->encode() : null,
                'prev_page_url' => $communityPosts->previousPageUrl(),
                'per_page' => $communityPosts->perPage(),
                'path' => url('/get-community-post'),
            ],
					]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
	//function for fetching community posts
		function getCommunityWorkfolios(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				$communityId = $request->communityId;
				
				$communityWorkfolios = CommunityWorkfolio::where('community_id', $communityId)
					->with([
                'workfolio' => function ($query) use ($user) {
                    $query->select('id', 'title',   'created_at', 'user_id')
												->with([
															'user:id,userID', 
															 'user.customer:id,user_id,image', 
													])
										->withAvg('workfolioReview', 'rating')
										->withCount('workfolioReview');
                },
								'sender:id,userID',
								'sender.customer:id,user_id,image',
            ])
					->orderBy('id', 'desc')
					->cursorPaginate(10);		
						
					 // Extract only the workfolio objects into an array
					$workfolioArray = [];

					foreach ($communityWorkfolios as $communityWorkfolio) {
							if ($communityWorkfolio->workfolio) {
									
									$workfolio = $communityWorkfolio->workfolio;
									
									 //getting full profile image url of owner
									$workfolio->user->customer->image = $workfolio->user->customer->image
									? url(Storage::url('profile_image/' . $workfolio->user->customer->image))  
									: null;
									
									
									//sender
									$workfolio->sender = $communityWorkfolio->sender;
									 //getting full profile image url of sender
									$workfolio->sender->customer->image = $workfolio->sender->customer->image
									? url(Storage::url('profile_image/' . $workfolio->sender->customer->image))  
									: null;
									$workfolioArray[] = $workfolio;
							}
					}
					
					$nextCursor = $communityWorkfolios->nextCursor();
					$prevCursor = $communityWorkfolios->previousCursor();
				
					$data = [
						'status' => true,
						'message'=> 'Community  workfolio list is  ready.', 
						'workList' => [
                'data' => $workfolioArray,
                'next_cursor' => $nextCursor ? $nextCursor->encode() : null,
                'next_page_url' => $communityWorkfolios->nextPageUrl(),
                'prev_cursor' => $prevCursor ? $prevCursor->encode() : null,
                'prev_page_url' => $communityWorkfolios->previousPageUrl(),
                'per_page' => $communityWorkfolios->perPage(),
                'path' => url('/get-community-workfolios'),
            ],
					];  
					
				 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for fetching community problems
		function getCommunityProblems(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				$communityId = $request->communityId;
				
				$communityProblems = CommunityProblem::where('community_id', $communityId)
					->with([
                'problem' => function ($query) use ($user) {
                    $query->select('id', 'title',   'created_at', 'user_id')
												->with([
															'user:id,userID', 
															 'user.customer:id,user_id,image', 
													])
										->withCount('solutions');
                },
								'sender:id,userID',
								'sender.customer:id,user_id,image',
            ])
					->orderBy('id', 'desc')
					->cursorPaginate(10);		
						
					 // Extract only the problem objects into an array
					$problemArray = [];

					foreach ($communityProblems as $communityProblem) {
							if ($communityProblem->problem) {
									
									$problem = $communityProblem->problem;
									
									 //getting full profile image url of owner
									$problem->user->customer->image = $problem->user->customer->image
									? url(Storage::url('profile_image/' . $problem->user->customer->image))  
									: null;
									
									//sender
									$problem->sender = $communityProblem->sender;
									//getting full profile image url of sender
									$problem->sender->customer->image = $problem->sender->customer->image
									? url(Storage::url('profile_image/' . $problem->sender->customer->image))  
									: null;
									$problemArray[] = $problem;
							}
					}
					
					$nextCursor = $communityProblems->nextCursor();
					$prevCursor = $communityProblems->previousCursor();
				
					$data = [
						'status' => true,
						'message'=> 'Community  problem list is  ready.', 
						'problemList' => [
                'data' => $problemArray,
                'next_cursor' => $nextCursor ? $nextCursor->encode() : null,
                'next_page_url' => $communityProblems->nextPageUrl(),
                'prev_cursor' => $prevCursor ? $prevCursor->encode() : null,
                'prev_page_url' => $communityProblems->previousPageUrl(),
                'per_page' => $communityProblems->perPage(),
                'path' => url('/get-community-problems'),
            ],
					];   
					
					 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	

	//function for fetching community jobs
		function getCommunityJobs(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				$communityId = $request->communityId;
				
				$communityJobs = CommunityJob::where('community_id', $communityId)
					->with([
                'companyJob' => function ($query) use ($user) {
                    $query->select('id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  )
										->with([  
											'company:id,name,logo',
											'attempts' => function ($query) use ($user) {
													$query->where('user_id', $user->id)
														->select('id','company_job_id','status'); 
											}						
										])	
										->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
										$query->where('user_id', $user->id);
										}])
										->withExists(['applications as already_applied' => function ($query) use ($user) {
											$query->where('user_id', $user->id);
										}]);
                },
								'sender:id,userID',
								'sender.customer:id,user_id,image',
            ])
					->orderBy('id', 'desc')
					->cursorPaginate(10);		
						
					 // Extract only the job objects into an array
					$jobArray = [];

					foreach ($communityJobs as $communityJob) {
							if ($communityJob->companyJob) {
									
									$job = $communityJob->companyJob;
									
									
									//getting full profile image url of user
									$job->user->customer->image = $job->user->customer->image
									? url(Storage::url('profile_image/' . $job->user->customer->image))  
									: null;
									
									//getting full profile image url of company
									if (!filter_var($job->company->logo, FILTER_VALIDATE_URL)) {
										$job->company->logo = $job->company->logo
												? url(Storage::url('company_logo/' . $job->company->logo))
												: null;
									}

									
									
									//sender
									$job->sender = $communityJob->sender;
									 //getting full profile image url of sender
									$job->sender->customer->image = $job->sender->customer->image
									? url(Storage::url('profile_image/' . $job->sender->customer->image))  
									: null;
									$jobArray[] = $job;
							}
					}
					
					$nextCursor = $communityJobs->nextCursor();
					$prevCursor = $communityJobs->previousCursor();
				
					$data = [
						'status' => true,
						'message'=> 'Community  job list is  ready.', 
						'jobList' => [
                'data' => $jobArray,
                'next_cursor' => $nextCursor ? $nextCursor->encode() : null,
                'next_page_url' => $communityJobs->nextPageUrl(),
                'prev_cursor' => $prevCursor ? $prevCursor->encode() : null,
                'prev_page_url' => $communityJobs->previousPageUrl(),
                'per_page' => $communityJobs->perPage(),
                'path' => url('/get-community-jobs'),
            ],
					];   
					 
					
					 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}



			//function for fetching community freelance
		function getCommunityFreelances(Request $request)
		{
			 
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$communityId = $request->communityId;
				
				$communityFreelanceWorks = CommunityFreelance::where('community_id', $communityId)
					->with([
                'freelance' => function ($query) use ($user) {
                    $query->select('id','user_id', 'title',   'skill_required', 'deadline',  'budget_min',  'budget_max','payment_type', 'created_at'  )
										->with([  
												'user:id,userID',
												'user.customer:id,user_id,image', 
											
											]) 
											->withExists(['savedFreelance as has_saved' => function ($query) use ($user) {
												$query->where('user_id', $user->id);
											}])
											->withExists(['bids as already_bid' => function ($query) use ($user) {
												$query->where('user_id', $user->id);
											}]);
                },
								
								'sender:id,userID',
								'sender.customer:id,user_id,image',
            ])
					->orderBy('id', 'desc')
					->cursorPaginate(10);		
						
					 // Extract only the freelance objects into an array
					$freelanceArray = [];

					foreach ($communityFreelanceWorks as $communityFreelanceWork) {
							if ($communityFreelanceWork->freelance) {
								
									//getting owner user of freelance and calculating avg rating
									 $selectedUser = $communityFreelanceWork->freelance->user;
									// Calculate hirer review stats
									$hirerReview = [
											'avg_rating' => $selectedUser->hirerReviewsReceived()->avg('rating') ?? 0,
											'review_count' => $selectedUser->hirerReviewsReceived()->count(),
									];
									// Add the stats to the user object within the freelance
									$communityFreelanceWork->freelance->user->hirer_review_stats = $hirerReview;
							 	
									
									//getting sender from every item  collection and putting in freelance as sender
									$freelance = $communityFreelanceWork->freelance;
									
									//getting full profile image url of user
								 
									if (!filter_var($freelance->user->customer->image, FILTER_VALIDATE_URL)) {
										$freelance->user->customer->image = $freelance->user->customer->image
												? url(Storage::url('profile_image/' . $freelance->user->customer->image))
												: null;
									}
									
									//sender
									$freelance->sender = $communityFreelanceWork->sender;
									 //getting full profile image url of sender
									$freelance->sender->customer->image = $freelance->sender->customer->image
									? url(Storage::url('profile_image/' . $freelance->sender->customer->image))  
									: null;
									$freelanceArray[] = $freelance;
							}
					}
					
					$nextCursor = $communityFreelanceWorks->nextCursor();
					$prevCursor = $communityFreelanceWorks->previousCursor();
				
					$data = [ 
						'status' => true,
						'message'=> 'Community  freelance list is  ready.', 
						'freelanceList' => [
                'data' => $freelanceArray,
                'next_cursor' => $nextCursor ? $nextCursor->encode() : null,
                'next_page_url' => $communityFreelanceWorks->nextPageUrl(),
                'prev_cursor' => $prevCursor ? $prevCursor->encode() : null,
                'prev_page_url' => $communityFreelanceWorks->previousPageUrl(),
                'per_page' => $communityFreelanceWorks->perPage(),
                'path' => url('/get-community-freelances'),
            ],
					];   
					 
					 
					 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function to  fetching communities for share
		function getCommunitiesForShare(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					$searchInput = $request->input('searchInput');
			
					
					$communityListQuery = Community::select('id', 'name',  'created_by', 'image' )
					->where('created_by', $user->id) 
					->withCount('members');
			
					if ($searchInput) { 
						// Split searchInput into an array of words
						$searchWords = array_filter(explode(' ', $searchInput));

						$communityListQuery->where(function ($query) use (  $searchWords) {
							 
							foreach ($searchWords as $word) {
											$query->orWhere('name', 'like', "%$word%"); // Use 'like' for each word
									}
						});
					} 	
				$communityList = $communityListQuery->cursorPaginate(10); 
			
			
				 
					
					// Convert image paths to full URLs
         foreach ($communityList as $community) {
            $community->image = $community->image
                ? url(Storage::url('community_profile_image/' . $community->image))  
                : null;
        } 
					
					$data = ['status' => true,'message'=> 'Community list is ready.', 'communityList'=> $communityList, 'searchInput'=>$searchInput ]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		//function for share with communitites
		function shareWithCommunities(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$authUser = JWTAuth::parseToken()->authenticate();
				
				$shareId = $request->shareId;
				$shareType = $request->shareType;
				$selectedCommunities = $request->selectedCommunities;
				
				//loop through the selected user to check they have chat with logged user
		
				for($i = 0; $i < count($selectedCommunities); $i++)
				{
					$communityId =  $selectedCommunities[$i]['id'];
					switch($shareType)
					{
						case 'post':
						{ 
							$sharedPost = new CommunityPost();
							$sharedPost->community_id = $communityId;
							$sharedPost->post_id = $shareId;
							$sharedPost->sender_id = $authUser->id;
							$sharedPost->save();
							break;
						}
						case 'workfolio':
						{
							$sharedWorkfolio = new CommunityWorkfolio();
							$sharedWorkfolio->community_id = $communityId;
							$sharedWorkfolio->workfolio_id = $shareId;
							$sharedWorkfolio->sender_id = $authUser->id;
							$sharedWorkfolio->save();
							break;
						}
						case 'problem':
						{
							$sharedProblem = new CommunityProblem();
							$sharedProblem->community_id = $communityId;
							$sharedProblem->problem_id = $shareId;
							$sharedProblem->sender_id = $authUser->id;
							$sharedProblem->save();
							break;
						}
						case 'job':
						{
							$sharedJob = new CommunityJob();
							$sharedJob->community_id = $communityId;
							$sharedJob->company_job_id = $shareId;
							$sharedJob->sender_id = $authUser->id;
							$sharedJob->save();
							break;
						} 
						case 'freelance':
						{
							$sharedFreelance = new CommunityFreelance();
							$sharedFreelance->community_id = $communityId;
							$sharedFreelance->freelance_id = $shareId;
							$sharedFreelance->sender_id = $authUser->id;
							$sharedFreelance->save();
							break;
						}  
						default :
						{
							break;
						}
					}
				}

				
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> $shareType.' has shared with communities successfully.',   ]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status'=>false, 'message'=>$e->getMessage()];
				return response()->json($data);
			}
		}
		
		
}
