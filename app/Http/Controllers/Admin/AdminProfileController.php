<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator; 

use App\Models\User;
use JWTAuth;
use Exception;
class AdminProfileController extends Controller
{
    //function for fetch admin profile data 
		function getAdminProfile()
		{
			try
			{ 
				// Retrieve the authenticated user from the JWT token
				$authUser = JWTAuth::parseToken()->authenticate();
			
				$user = User::select('id', 'email', 'name', 'userID')
						->where('id',$authUser->id)
						->with([ 'admin',]) 
						->first();  
				
				
				//getting full profile image url of owner
				if($user->admin != null)
				{
					$user->admin->image = $user->admin->image
					? url(Storage::url('profile_image/' . $user->admin->image))  
					: null;
				}
				
				
				return response()->json([
            'status' => true,
            'message' => 'Admin profile fetched successfully.',
            'user' => $user,
             
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
		
		//function for update admin profile image
		function updateProfileImage(Request $request)
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
				// Retrieve the authenticated user from the JWT token
				$authUser = JWTAuth::parseToken()->authenticate();
			
				$selectedUserRole = $authUser->admin;
				
				//check the profile image exist. if true then delete 
				$imagePath = 'profile_image/' . $selectedUserRole->image;
				if (Storage::disk('public')->exists($imagePath)) {  
					Storage::disk('public')->delete($imagePath);
				} 
				
				//generating name for image
				$imageName='admin_profile_image_'.$authUser->id.'.'.$request->profile_image->extension();
					
				$request->profile_image->storeAs('profile_image', $imageName, 'public');

				//update in database
				$selectedUserRole->update(['image' => $imageName]);
				$selectedUserRole->save();
					 	
				
				//getting full profile image url of owner
				$selectedUserRole->image = $selectedUserRole->image
				? url(Storage::url('profile_image/' . $selectedUserRole->image))  
				: null;			
				
				
				return response()->json([
            'status' => true,
            'message' => 'Admin profile fetched successfully.',
            'image'=> $selectedUserRole->image 
             
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
		
		
		//function for update user Detail
		function updateProfileDetail(Request $request)
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
					 
					$authUser->load('admin');
					$selectedUserRole = $authUser->admin;
						
					$selectedUserRole->update([$request->name => $request->value]);
					$selectedUserRole->save();
				}
				
			 
				 
				// Return the data as a JSON response
				$data = ['status' => true, 'message'=> 'Admin profile detail is updated.']; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong. Try again'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
	
}
