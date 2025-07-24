<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Call; 

use Exception;
use JWTAuth;

class CallController extends Controller
{
    //function for initiate call 
		function initiateCall(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Calling to user.',  ]; 
				return response()->json($data);
				
			}
			catch(Exception $err)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for accepting call 
		function acceptCall(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> ' ',  ]; 
				return response()->json($data);
				
			}
			catch(Exception $err)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		//function for rejecting call 
		function rejectCall(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> ' ',  ]; 
				return response()->json($data);
				
			}
			catch(Exception $err)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for ending call 
		function endCall(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> ' ',  ]; 
				return response()->json($data);
				
			}
			catch(Exception $err)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for call signaling  
		function callSignal(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> ' ',  ]; 
				return response()->json($data);
				
			}
			catch(Exception $err)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for call media  
		function callMedia(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> ' ',  ]; 
				return response()->json($data);
				
			}
			catch(Exception $err)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
}
