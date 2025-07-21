<?php

namespace App\Http\Controllers\User; 

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

use App\Models\User;
use App\Models\Follower;
use App\Models\ChatList;
use App\Models\Otp;

use App\Events\ProfileFollowingsCountUpdate; 
use App\Events\ProfileFollowersCountUpdate; 
use App\Events\ProfileUpdateEvent; 

use App\Mail\sendOTP;

use Carbon\Carbon;
use JWTAuth;
use Mail;
use Exception;
class UserProfileController extends Controller
{
	//function to get user info for user profile
	function getUserProfile(Request $request)
	{
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate();
			
			$user = User::select('id', 'email', 'name', 'userID')
						->where('id',$request->userId)
						->with([  				'customer:id,user_id,mobile_number,city_village,state,country,interest,about,image', 
						'company:id,user_id,name,logo'		
						])
						->withCount('followers')
						->withCount('following')
						->first(); 
			
			if(!$user)
			{
				return response()->json([
				'status' => false,
				'message'=> 'User not found.', 
				]);
			}
			
			// Check if the authenticated user is following the profile user
			$isFollowing = false;
			if ($authUser) {
					$isFollowing = $user->followers()->where('follower_id', $authUser->id)->exists();
			}
			$user->isFollowing =  $isFollowing;
			
			
			//other user id for getting chat info
			$otherUserId = $request->userId;
			
			
			//if fetched user is not logged user then getting chat info
			if($otherUserId != $authUser->id)
			{
				$chatsWithUser = ChatList::where(function ($query) use ($otherUserId, $authUser) {
							$query->where('user_one_id', $authUser->id)
										->where('user_two_id', $otherUserId);
					})->orWhere(function ($query) use ($otherUserId, $authUser) {
							$query->where('user_one_id', $otherUserId)
										->where('user_two_id', $authUser->id);
					})->first();
				if($chatsWithUser != null)
				{
					$user->chat_id = $chatsWithUser->id;
				}
				else
				{
					$user->chat_id = null;
				}
			}
			else
			{
				$user->chat_id = null;
			}
			
			
			//getting full profile image url of owner
				$user->customer->image = $user->customer->image
				? url(Storage::url('profile_image/' . $user->customer->image))  
				: null;	
			
			//getting full profile image url of owner
			if($user->company != null)
			{
				$user->company->logo= $user->company->logo
				? url(Storage::url('company_logo/' . $user->company->logo))  
				: null;	
			}
			// Return the posts as a JSON response
			$data = [
			'status' => true,
			'message'=> 'User Detail is ready.',
			'userData'=>$user, 	
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


	//function to follow or unFollow the user
	function followUser(Request $request)
	{
		try
		{
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			$checkFollow = Follower::where('follower_id',$user->id)
																->where('following_id',$request->userId)
																->first(); 
			$follow="Follow";
			if($checkFollow)
			{
				$checkFollow->delete();
				$follow=false;
			}
			else
			{
				Follower::create(['follower_id'=>$user->id, 'following_id'=>$request->userId]);
				$follow=true;
			} 
			
			//get selected user with followings and followers
			$selectedUser = User::withCount(['followers'])
    ->findOrFail($request->userId);

			
			//Dispatching event 
			ProfileFollowersCountUpdate::dispatch([ 
				'following_id'=> $request->userId,
				'follower_id'=> $user->id,
				'followers_count'=> $selectedUser->followers_count, 
			]);
			ProfileFollowingsCountUpdate::dispatch([ 
				'following_id'=> $request->userId,
				'follower_id'=> $user->id,
				'selected_user_following_count'=> $user->following()->count(), 
			]);
			
			
			// Return the posts as a JSON response
			$data = [
			'status' => true,
			'is_follow'=> $follow ,
			'followers_count'=> $selectedUser->followers_count,  
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

	//function to get follower of user
	function followerList(Request $request)
	{
		try
		{
			$userData = User::where('id',$request->userId)->first();
			
			$followData = $userData->followers()
														->with([
																'follower:id,userID,name',
																'follower.customer:id,user_id,image', 
															]) 
															->cursorPaginate(20);
				
			foreach ($followData as $item) 
			{
					 
				if ($item->follower->customer != null && !filter_var($item->follower->customer->image, FILTER_VALIDATE_URL)) 
				{ 				
					//getting full profile image url 
					$item->follower->customer->image = $item->follower->customer->image
					? url(Storage::url('profile_image/' . $item->follower->customer->image))  
					: null;
				}
				
			}
			
				
			$data = ['status' => true,'message'=> 'Follower list is ready', 'followers'=>$followData]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	//function to get following of user
	function followingList(Request $request)
	{
			try
			{
				// Authenticate the user using JWT
        $user = JWTAuth::parseToken()->authenticate();
				
				$userId = $request->input('userId', $user->id);
				$userData = User::where('id',$userId)->first();
				
					$followData = $userData->following()
															->with([
																	'following:id,userID,name',
																	'following.customer:id,user_id,image', 
																]) 
																->cursorPaginate(20);
				
				foreach ($followData as $item) 
				{
						 
					if ($item->following->customer != null && !filter_var($item->following->customer->image, FILTER_VALIDATE_URL)) 
					{ 				
						//getting full profile image url 
						$item->following->customer->image = $item->following->customer->image
						? url(Storage::url('profile_image/' . $item->following->customer->image))  
						: null;
					}
					
				}	
					
				$data = ['status' => true,'message'=> 'Following list is ready', 'followings'=>$followData]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}

	//function for update user profile image
	function updateUserProfileImage(Request $request)
	{
		
			$messages = [
					'profile_image.required' => 'The profile image is required.',
					'profile_image.image' => 'The file must be an image.',
					'profile_image.mimes' => 'The profile image must be a file of type: jpeg, png, jpg.',
					'profile_image.max' => 'The profile image may not be greater than 5 MB.',
			];

			// Validate the request with custom messages
			$validator = Validator::make($request->all(), [
					'profile_image' => 'required|image|mimes:jpeg,png,jpg|max:5120',
			], $messages);
			if ($validator->fails()) {
					// Return validation errors within the try block
					return response()->json(['status' => false, 'message' => $validator->errors()->first()]);
				 
			}
			
			try
			{ 
					$authUser = JWTAuth::parseToken()->authenticate();
					$selectedUserRole = null;
					 
					$authUser->load('customer');
					$selectedUserRole = $authUser->customer;
					 
					 
				 
				 //check the profile image exist. if true then delete 
					$imagePath = 'profile_image/' . $selectedUserRole->image;
							if (Storage::disk('public')->exists($imagePath)) {  
                Storage::disk('public')->delete($imagePath);
							} 
					 
					
					//generating name for image
					$imageName='profile_image_'.$authUser->id.'.'.$request->profile_image->extension();
					//moving file to profile_image folder in public directory
					//$request->profile_image->move(public_path('profile_image/'), $imageName);
					$request->profile_image->storeAs('profile_image', $imageName, 'public');

					//update in database
					$selectedUserRole->update(['image' => $imageName]);
					$selectedUserRole->save();
					 
				
				
					//getting full profile image url of owner
					$selectedUserRole->image = $selectedUserRole->image
					? url(Storage::url('profile_image/' . $selectedUserRole->image))  
					: null;			
				
					//Dispatching event
					ProfileUpdateEvent::dispatch([ 
						'user_id'=> $authUser->id, 
						'name'=>'image',
						'val'=>$selectedUserRole->image,
					]);
					
					
					
					return response()->json(['status'=>true, 'data'=> $selectedUserRole->image ]);
			
				
				// Retrieve the authenticated user from the JWT token
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}

	
	//function for update user Detail
	function updateUserDetail(Request $request)
	{
		
			 
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate(); 
			$selectedUserRole = null;
			
			
			if($request->name == 'name')
			{
				$authUser->update(['name' => $request->value]);
				$authUser->save();
			}
			else
			{
				 
				$authUser->load('customer');
				$selectedUserRole = $authUser->customer;
				  
				$selectedUserRole->update([$request->name => $request->value]);
				$selectedUserRole->save();
			}
			
			//Dispatching event
			ProfileUpdateEvent::dispatch([ 
				'user_id'=> $authUser->id, 
				'name'=>$request->name,
				'val'=>$request->value,
			]);
			 
			// Return the data as a JSON response
			$data = ['status' => true, 'message'=> 'User Detail is updated.']; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong. Try again'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	function updateUserID(Request $request)
	{
		
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate(); 
			
			$newUserID = $request->value;
			
			$exists = User::where('userID', $newUserID)->doesntExist();
			if($exists == false)
			{
				$data = ['status' => false, 'message'=> 'UserID must be unique.']; 
				return response()->json($data);
			}
			
			$authUser->update(['userID' => $newUserID]);
			$authUser->save();
			
			//Dispatching event
			ProfileUpdateEvent::dispatch([ 
				'user_id'=> $authUser->id, 
				'name'=>'userID',
				'val'=>$newUserID,
			]);
			
			//return data as a JSON response
			$data = ['status' => true, 'message'=> 'UserID is updated.']; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	//function for verify email and send otp
	function updateEmailSendOTP(Request $request)
		{
			 

			// Manually validate request data
       $validator = Validator::make($request->all(), [
            'email' => 'required|email|unique:users',
         ],[
					'email.unique' => 'This email is already registered. Please use a different one.',
			]);
			// Check if validation fails
      if ($validator->fails()) {
					// Return validation errors within the try block
					return response()->json(['status' => false, 'message' => $validator->errors()->first()]);
				 
			}
			 
			try
			{
				 $otpCode = rand(100000, 999999);

        Otp::create([
            'email' => $request->email,
            'otp' => $otpCode,
            'expires_at' => Carbon::now()->addMinutes(5),
        ]);
				
				Mail::to($request->email)->send(new sendOTP($otpCode, 5));	
					$data = ['status' => true,'message'=>"OTP send on email."];
					return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
	//function for update email
	function updateEmail(Request $request)
	{
		// Step 1: Validate input
		  
       $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'otp' => 'required|digits:6'
         ]);
			// Check if validation fails
      if ($validator->fails()) {
					// Return validation errors within the try block
					return response()->json(['status' => false, 'message' => $validator->errors()->first()]);
				 
			}
	
		
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate(); 
			
			// Step 2: Find a valid OTP record
        $otpRecord = Otp::where('email', $request->email)
            ->where('otp', $request->otp)
            ->where('expires_at', '>', Carbon::now())
            ->latest()
            ->first();
				
			 // Step 3: Handle failure
        if (!$otpRecord) {
            return response()->json([
                'status' => false,
                'message' => 'Invalid or expired OTP. Please try again.'
            ]);
        }
				
				
			// Step 4:  Update Email
			$authUser->update(['email' => $request->email]);
			$authUser->save();
			
			// Step 5: Delete All OTP Related to Email
			Otp::where('email', $request->email)->delete();

			
			//Dispatching event
			ProfileUpdateEvent::dispatch([ 
				'user_id'=> $authUser->id, 
				'name'=>'email',
				'val'=>$request->email,
			]);
			
			//return data as a JSON response
			$data = ['status' => true, 'message'=> 'Email is updated successfully.']; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	//function for remove technology or skills
	function removeInterest(Request $request)
	{
		
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate(); 
			$selectedUserRole = null;
			 
			$authUser->load('customer');
			$selectedUserRole = $authUser->customer;
			$fieldName = 'interest';
			 
			
			$preTechSkill = $selectedUserRole[$fieldName];
			$newTechSkill = [];
			for($i=0; $i < count($preTechSkill); $i++)
			{
				if($request->index == $i)
				{
					continue;
				} 
				$newTechSkill[] = $preTechSkill[$i];
			} 
			
			$selectedUserRole->update([$fieldName => $newTechSkill]);
			$selectedUserRole->save();
			 
			//Dispatching event
			ProfileUpdateEvent::dispatch([ 
				'user_id'=> $authUser->id, 
				'name'=>$fieldName,
				'val'=>$newTechSkill,
			]); 
			
			//return data as a JSON response
			$data = ['status' => true, 'message'=> "Technology or Skill is removed successfully." , 'interest'=> $newTechSkill]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	//function for add new technology or skills
	function addInterest(Request $request)
	{
		
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate(); 
			$authUser->load('customer');
			$selectedUserRole = $authUser->customer;
			 
			
			$preInterest = $selectedUserRole['interest'];
			$preInterest[] = $request->newInterest;
			
			$selectedUserRole->update(['interest' => $preInterest]);
			$selectedUserRole->save();
			 
			//Dispatching event
			ProfileUpdateEvent::dispatch([ 
				'user_id'=> $authUser->id, 
				'name'=>'interest',
				'val'=>$preInterest,
			]); 
			
			//return data as a JSON response
			$data = ['status' => true, 'message'=> "New interest is added successfully." , 'interest'=> $preInterest]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$daata = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	//function for verify current password
	function verifyCurrentPassword(Request $request)
	{
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate();
			$data = []; 
			
			if(Hash::check($request->password,$authUser->password))  
			{
				$data = ['status' => true, 'message'=> "Entered password is verified successfully."];  
			}
			else{
				$data = ['status' => false, 'message'=> "Entered password is not current password."]; 
			}
		
			//return data as a JSON response
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	//function for update password
	function updatePassword(Request $request)
	{
		// Validate the request data
		$validator = Validator::make($request->all(), [
				'password' => [
            'required',
            Password::min(8)
                ->mixedCase()
                ->letters()
                ->numbers()
                ->symbols()
        ],
		]);

		if ($validator->fails()) {
				return response()->json([
						'status' => false,
						'message' => $validator->errors()->first(),
				]);
		}
		try
		{
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate(); 
			if(Hash::check($request->password,$authUser->password))  
			{  
				return response()->json(['status' => false, 'message'=> "New password is same as previous password."]);
			}
			$authUser->password = Hash::make($request->password);
			$authUser->save();
			
			//Logout the user
			Auth::logout(); 
			JWTAuth::invalidate(JWTAuth::getToken());
			
			//return data as a JSON response
			$data = ['status' => true, 'message'=> "Password is updated successfully."]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
}
