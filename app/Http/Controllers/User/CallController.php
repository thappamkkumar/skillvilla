<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

use App\Models\Call; 
use App\Models\Message; 
use App\Models\ChatList; 

use App\Events\ChatCallIncomingEvent;
use App\Events\ChatCallEndEvent;
use App\Events\SendMessageEvent;

use Exception;
use JWTAuth;
use Carbon\Carbon; 

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
				
				//creating call
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
						'message' => ucfirst($call->call_type) .' '. 'Call Started',
				]);
				
				$call->messages()->save($message); // This sets call_id
				
				
				//filtering message data
				$newMessage  = $message->only(['id', 'chat_list_id', 'sender_id', 'message', 'attachment','post_id',	'workfolio_id',	'problem_id',	'company_job_id',	'freelance_id',		'stories_id',	'community_id',	'user_id',  'is_read', 'created_at','human_readable_message_time']);
					
					
				// Fetch the related chat list
				$chatList = ChatList::findOrFail($chat_id);

				// Determine the receiver's ID
				$messageReceiver = $chatList->getOtherUser($user->id);
				
				//add receiver info
				$newMessage['receiver_id'] = $messageReceiver->id ?? null; // Assign receiver_id as an array key
				
				//formating created_at for add message list on client side
				$date = Carbon::parse($newMessage['created_at']);  
				$newMessage['created_at'] =  $date->format('d-m-Y');

				
				
				
				
				//loading required data of caller and reciver
				$call->load([
						'caller:id,userID,name',
            'caller.customer:id,user_id,image',  
						'receiver:id,userID,name',
            'receiver.customer:id,user_id,image', 
				]);
				
				//getting url of profile image of users
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
				
					
				
				//dispatching events
				
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
				
				SendMessageEvent::dispatch( 
					 $newMessage 
				); 
				
				
				
				
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
					'newMessage'=>$newMessage,
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
		
		
			//function for ending call 
		function endCall(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				 // Validate input
        $request->validate([
            'call_id' => 'required|integer|exists:calls,id',
        ]);

        // Fetch the call
        $call = Call::findOrFail($request->call_id);

        // Ensure the user is part of the call (optional, for security)
        if ($call->caller_id !== $user->id && $call->receiver_id !== $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }
				
				 // Update call status
        $call->status = 'ended';
        $call->ended_at = now(); // optional if you track end time
        $call->save();
				
				
				 //   Get chat_list_id from existing message related to this call
        $chat_id = Message::where('call_id', $call->id)->value('chat_list_id');

        // Fallback if not found (optional check)
        if (!$chat_id) {
            return response()->json([
                'status' => false,
                'message' => 'Unable to find chat related to this call.',
            ], 404);
        }
				
				// Also create a message linked to the call
				$message = new Message([
						'chat_list_id' => $chat_id,
						'sender_id' => $call->caller_id,
						'message' => ucfirst($call->call_type) .' '. ' Call Ended',
				]);

				$call->messages()->save($message); // This sets call_id
				
				
				//filtering message data
				$newMessage  = $message->only(['id', 'chat_list_id', 'sender_id', 'message', 'attachment','post_id',	'workfolio_id',	'problem_id',	'company_job_id',	'freelance_id',		'stories_id',	'community_id',	'user_id',  'is_read', 'created_at','human_readable_message_time']);
					
					
				// Fetch the related chat list
				$chatList = ChatList::findOrFail($chat_id);

				// Determine the receiver's ID
				$messageReceiver = $chatList->getOtherUser($user->id);
				
				//add receiver info
				$newMessage['receiver_id'] = $messageReceiver->id ?? null; // Assign receiver_id as an array key
				
				//formating created_at for add message list on client side
				$date = Carbon::parse($newMessage['created_at']);  
				$newMessage['created_at'] =  $date->format('d-m-Y');

				
				
				
				$caller_id = $call->caller_id;
				$receiver_id = $call->receiver_id;

				$otherUserId = $user->id == $caller_id ? $receiver_id : $fromUserId;

				//dispatch event for call end
				ChatCallEndEvent::dispatch( $otherUserId , $call->id, 'Call Ended' ); 
				SendMessageEvent::dispatch( 
					 $newMessage 
				);
				
				// Return the posts as a JSON response
				$data = [
				'status' => true,
				'message'=> 'Call Ended', 
				'newMessage'=>$newMessage, ]; 
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
