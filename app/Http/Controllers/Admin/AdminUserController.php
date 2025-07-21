<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\User;

use JWTAuth;
use Exception;

class AdminUserController extends Controller
{
    //fetch  list of use excluded admin
		function getUserList()
		{
			try
			{ 
				
				$userList = User::select(['id','userID', 'name','email','user_role',  'is_active'])
				->with([
					'customer:id,user_id,image'
				])
				->whereNot('user_role', 'Admin')
				->orderBy('id', 'desc')
				->cursorPaginate(50);
				
				// Convert image paths to full URLs
         foreach ($userList as $user) {
					 if($user->customer == null)
					 {
						 continue;
					 }
            $user->customer->image = $user->customer->image
                ? url(Storage::url('profile_image/' . $user->customer->image))  
                : null;
        } 
				
				return response()->json([
            'status' => true,
            'message' => 'User list fetched successfully.',
            'userList' => $userList,
            
             
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
		
		
		//update is active status of user
		function updateUserActiveStatus(Request $request)
		{
			// Validate the incoming data
				$request->validate([
						'user_id' => 'required|exists:users,id',
				]);

				
			try
			{
				$userId = $request->user_id;
				
				$user = User::findOrFail($userId);
				$user->is_active = !$user->is_active;
				$user->save();
				
				return response()->json([
            'status' => true,
            'message' => 'User active status updated successfully.',
            'is_active' => $user->is_active, 
        ]);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status'=> false, 'message'=>$e->getMessage()];
				return response->json($data);
			}
		}
		
		
		//fetch user profile
		function getUserProfile(Request $request)
		{
			 
			try
			{
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
				$data = ['status'=> false, 'message'=>$e->getMessage()];
				return response->json($data);
			}
		}
		
		//delete user
		function deleteUser(Request $request)
		{
			// Validate the incoming data
				$request->validate([
						'user_id' => 'required|exists:users,id',
				]);
				
				
			try
			{
				$user = User::findOrFail($request->user_id);
				
				if ($user->customer && $user->customer->image) 
				{
          $existingProfile = $user->customer->image;
					$profilePath = public_path("profile_image/$existingProfile");
					if(file_exists($profilePath)) {
						 unlink($profilePath);
					}
        }
				
				 foreach ($user->posts as $post) {
            // Delete post attachments if they exist
            if ($post->attachment) {
                $attachmentPath = public_path("post_attachments/{$post->attachment}");
                
                if (file_exists($attachmentPath)) {
                    unlink($attachmentPath);
                }
            }
             
        }
				
				
				$user->delete();
				 
				$data = [
					'status' => true,
					'message'=> 'User is deleted successfully.', 
					]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status'=> false, 'message'=>$e->getMessage()];
				return response->json($data);
			}
		}
		
		
		
}
