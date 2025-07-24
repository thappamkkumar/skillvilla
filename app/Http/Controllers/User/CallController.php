<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Call; 
use App\Models\Message; 

use App\Events\ChatCallIncomingEvent;

use Exception;
use JWTAuth;

class CallController extends Controller
{
    //function for initiate call 
		function initiateCall(Request $request)
		{
			try
			{
				if(!$request->receiver_id)
				{
					$data = ['status' => false,'message'=> "User must be selected before calling."];
					return response()->json($data);
				}
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$chat_id = $request->chat_id;
				$caller_id = $user->id;
				$receiver_id = $request->receiver_id;
				$call_type = $request->call_type;
				$call_room_id = Str::uuid();;

				$call = Call::create([
					'caller_id' => $caller_id,
					'receiver_id' => $receiver_id,
					'call_type' => $call_type,
					'room_id' => $call_room_id,
					'status' => 'initiated',
					'started_at' => now(),
				]);
				
				// Also create a message linked to the call
				$message = new Message([
						'chat_list_id' => $chat_id,
						'sender_id' => $call->caller_id,
						'message' => ucfirst($call->call_type) . ' call started',
				]);

				$call->messages()->save($message); // This sets call_id
				
				$call->load([
						'caller:id,userID,name',
            'caller.customer:id,user_id,image',  
						'receiver:id,userID,name',
            'receiver.customer:id,user_id,image', 
				]);
				
				if ($call->caller->customer != null && !filter_var($call->caller->customer->image, FILTER_VALIDATE_URL)) 
				{ 
					$call->caller->customer->image = $call->caller->customer->image
					? url(Storage::url('profile_image/' . $call->caller->customer->image))  
					: null; 
				}	
				if ($call->receiver->customer != null && !filter_var($call->receiver->customer->image, FILTER_VALIDATE_URL)) 
				{ 
					$call->receiver->customer->image = $call->receiver->customer->image
					? url(Storage::url('profile_image/' . $call->receiver->customer->image))  
					: null; 
				}	
				
					
				
				
				
				ChatCallIncomingEvent::dispatch( [
					'call_id'    => $call->id,
					'room_id'    => $call->room_id,
					'call_type'  => $call->call_type,
					'started_at' => $call->started_at,
					'caller'     => [
							'id'    => $call->caller->id,
							'name'  => $call->caller->name,
							'userID'  => $call->caller->userID,
							'image' => $call->caller->customer->image,
					],
					'receiver_id' => $call->receiver->id,
				] ); 
				
				// Return the posts as a JSON response
				$data = ['status' => true,
					'message'=> 'Calling to user.', 
					'callData' => [
						'id'         => $call->id,
						'room_id'    => $call->room_id,
						'call_type'  => $call->call_type,
						'started_at' => $call->started_at,
						'receiver'   => [
								'id'    => $call->receiver->id,
								'name'  => $call->receiver->name,
								'userID'  => $call->receiver->userID,
								'image' => $call->receiver->customer->image,
						],
						'caller'     => [
							'id'    => $call->caller->id,
							'name'  => $call->caller->name,
							'userID'  => $call->caller->userID,
							'image' => $call->caller->customer->image,
						],
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
			catch(Exception $e)
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
			catch(Exception $e)
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
			catch(Exception $e)
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
			catch(Exception $e)
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
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
}
