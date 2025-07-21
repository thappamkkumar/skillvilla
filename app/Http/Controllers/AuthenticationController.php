<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Str; 

use App\Models\User;
use App\Models\Otp;

use App\Mail\sendOTP;

use Carbon\Carbon;
use Mail;
use Exception;
use JWTAuth; 
class AuthenticationController extends Controller
{
	
		//function for authentication
		function login(Request $request)
		{
			try {
        // Validation rules
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
             
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please enter a valid email address.'
            ]);
        }
				$remember = $request->input('remember', false);
        $credentials = $request->only('email', 'password');
				
				
				/*$user=User::select('id', 'userID',   'email', 'name', 'is_active', 'user_role')
										->where('email', $request->email)
										->with([
													'customer:id,user_id,image',
 
											])
										->first();
				*/						
				$user = User::select('id', 'userID', 'email', 'name', 'is_active', 'user_role')
						->where('email', $request->email)
						->first();
 

				//check user if found or not
				if($user == null)
				{
					return response()->json(['status' => false, 'message' => 'Oops! We couldn`t find your account. Please sign up to continue.']); 
				}
				
				//check user account is active or not
				if($user->is_active != 1)
				{
					return response()->json(['status' => false, 'message' => 'Your account is not active. Please contact support for assistance.']); 
				}
				
				
				//fetch customer data in user role is customer
				if ($user && $user->user_role === User::ROLE_CUSTOMER)
				{
						$user->load('customer:id,user_id,image');
						// Generate full image URL dynamically based on storage disk
						$user->customer->image = $user->customer->image
            ? url(Storage::url('profile_image/' . $user->customer->image)) 
            : null; 
				}
				else
				{
						return response()->json(['status' => false, 'message' => 'Admin accounts must log in through the designated admin portal.']);  
				}
			
				 // Choose TTL based on "Remember Me"
				$ttl = $remember ? (60 * 24 * 30) : (60 * 24);  // 30 days vs 1 day

        // Dynamically set the TTL (token expire time) before generating the token
        JWTAuth::factory()->setTTL($ttl);  

				if ($token = JWTAuth::attempt($credentials))
				{
					 
					
					 return response()->json(['status' => true,'message' => 'Great! You`ve successfully logged in.', 'token' => $token, 'user' => $user]);
				}
				else {
						// Return error response if authentication fails
						return response()->json(['status' => false, 'message' => 'The provided credentials do not match our records.']);
				}
       
			} 
			catch (Exception $e)
			{
        // Return error response for any exceptions
        $data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
			//	$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);;
			}
			  
		}
   
		
		
		
		function adminLogin(Request $request)
		{
			try {
        // Validation rules
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
             
        ]);

        // If validation fails, return error response
        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Please enter a valid email address.'
            ]);
        }
				$remember = $request->input('remember', false);
        $credentials = $request->only('email', 'password');
				
				
				/*$user=User::select('id', 'userID',   'email', 'name', 'is_active', 'user_role')
										->where('email', $request->email)
										->with([
													'customer:id,user_id,image',
 
											])
										->first();
				*/						
				$user = User::select('id', 'userID', 'email', 'name', 'is_active', 'user_role')
						->where('email', $request->email)
						->first();
 

				//check user if found or not
				if($user == null)
				{
					return response()->json(['status' => false, 'message' => 'Oops! We couldn`t find your account. Please sign up to continue.']); 
				}
				
				//check user account is active or not
				if($user->is_active != 1)
				{
					return response()->json(['status' => false, 'message' => 'Your account is not active. Please contact support for assistance.']); 
				}
				
				
				//fetch customer data in user role is customer
				if ($user && $user->user_role === User::ROLE_CUSTOMER)
				{
						return response()->json(['status' => false, 'message' => 'You do not have permission to access this admin section.']);  
				}
				
			
				 // Choose TTL based on "Remember Me"
        $ttl = $remember ? (60 * 24 * 30) : (60 * 24);  // 30 days vs 1 day 

        // Dynamically set the TTL (token expire time) before generating the token
        JWTAuth::factory()->setTTL($ttl);  

				if ($token = JWTAuth::attempt($credentials   ))
				{
					 
					
					 return response()->json(['status' => true,'message' => 'Great! You`ve successfully logged in.', 'token' => $token, 'user' => $user]);
				}
				else {
						// Return error response if authentication fails
						return response()->json(['status' => false, 'message' => 'The provided credentials do not match our records.']);
				}
       
			} 
			catch (Exception $e)
			{
        // Return error response for any exceptions
        $data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
			//	$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);;
			}
			  
		}
   
	 
	 
	 
	 
		
		
		//function for email verfication and otp send 
		function emailVerificationSendOTP(Request $request)
		{
			// Manually validate request data
       $validator = Validator::make($request->all(), [
					'email' => 'required|email|unique:users',
			], [
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
				//sendOTP($otpCode, 5)  otp and time limit
				
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

		//function for  verfication of otp 
		function verifyingOTP(Request $request)
		{
			// Step 1: Validate input
       $request->validate([
            'email' => 'required|email',
            'otp' => 'required|digits:6',
        ]);
			
			try
			{
				 
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
				
				Otp::where('email', $request->email)->delete();


				$data = ['status' => true,'message'=>"OTP verified successfully."]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
			
		}

		
		//function for send otp for forget password 
		function forgotPasswordSendOTP(Request $request)
		{
			// Manually validate request data
       $validator = Validator::make($request->all(), [
					'email' => 'required|email',
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
				//sendOTP($otpCode, 5)  otp and time limit
				
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

	//function for  forget password 
		function forgotPassword(Request $request)
		{
			 $validator = Validator::make($request->all(), [ 
            'email' => 'required|email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols(),
            ],
        ], [
             
            // Email
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
             
            // Password
            'password.required' => 'Please enter a password.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.mixedCase' => 'Password must include both uppercase and lowercase letters.',
            'password.letters' => 'Password must contain at least one letter.',
            'password.numbers' => 'Password must contain at least one number.',
            'password.symbols' => 'Password must include at least one special character.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(), // Send only the first error
            ]);
        }
			
			try
			{
				$user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json([
                'status' => false,
                'message' => 'User not found.',
            ]);
        }

        // Update password
        $user->password = Hash::make($request->password);
        $user->save();
 
				 
				return response()->json([
            'status' => true,
            'message' => 'Password has been successfully updated. You can now log in with your new password.',
        ]);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
			
		}

	
		
		 
		
		//function for storing user data or autherisation
		function storeUser(Request $request)
		{
			try
			{
				 $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)
                    ->mixedCase()
                    ->letters()
                    ->numbers()
                    ->symbols(),
            ],
        ], [
            // Name
            'name.required' => 'Please enter your name.',

            // Email
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered. Please use another.',

            // Password
            'password.required' => 'Please enter a password.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.mixedCase' => 'Password must include both uppercase and lowercase letters.',
            'password.letters' => 'Password must contain at least one letter.',
            'password.numbers' => 'Password must contain at least one number.',
            'password.symbols' => 'Password must include at least one special character.',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(), // Send only the first error
            ]);
        }
				
				// Validation passed, store user data
        $user = User::create([
					'name'=>$request->name,
					'email'=>$request->email,
					'password'=>Hash::make($request->password),
					'user_role'=>'Customer',
					]);
				
				$data = ['status' => true,'message'=> 'Sign up successful! You can now log in.'];
				 return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		//on refresh or re enter check user has session on backend
		public function checkUser(Request $request)
		{
			try
			{
				//get user data
				$user = JWTAuth::parseToken()->authenticate();
				
				
        if (!$user) {
            return response()->json(['valid' => false, 'message' => 'User not found'], 404);
        }
				
				
				
				if ($user && $user->user_role === User::ROLE_CUSTOMER)
				{
						$user->load('customer:id,user_id,image');
						// Generate full image URL dynamically based on storage disk
						$user->customer->image = $user->customer->image
            ? url(Storage::url('profile_image/' . $user->customer->image)) 
            : null; 
				}
				
				// Fetch the payload to get the expiration time (exp claim)
        $payload = JWTAuth::getPayload();
        $expirationTime = $payload->get('exp'); // Expiration time in Unix timestamp

				// Get the current time (in seconds)
        $currentTime = time();

				 // Define the threshold for refreshing (24 hours = 86,400 seconds)
        $threshold = 86400; // 24 hours in seconds

				if ($expirationTime - $currentTime <= $threshold && $remember) 
				{
						// Step 1: Refresh the token (invalidate the old one)
						$refreshedToken = JWTAuth::refresh(JWTAuth::getToken());

						// Step 2: Authenticate user from refreshed token
						$user = JWTAuth::setToken($refreshedToken)->authenticate();

						// Step 3: Define TTL based on your logic (e.g., remember flag)
						$remember = $request->input('remember', false);
						$ttl = $remember ? (60 * 24 * 30) : (60 * 24); // 30 days or 1 day

						// Step 4: Set the new TTL
						JWTAuth::factory()->setTTL($ttl);

						// Step 5: Issue a new token with updated expiration
						$newToken = JWTAuth::fromUser($user);

						return response()->json([
            'status' => true,
            'user' => $user, 
            'newToken' => $newToken, 
						]);
				}
				
        return response()->json([
            'status' => true,
            'user' => $user, 
        ]);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Token is invalid or expired.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	


		//function for logout
		public function logout(Request $request)
    {
			try
			{
			//	$user = JWTAuth::parseToken()->authenticate();
				JWTAuth::invalidate(JWTAuth::getToken());
				
				//comment code is for session base authentication
				 // Clear the remember_token
        /*if ($user) {
            $user->setRememberToken(null);
            $user->save();
        }
				Auth::logout(); 
				*/
				
        return response()->json(['status' => true,'message' => 'Successfully logged out']);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
        
    }



}
