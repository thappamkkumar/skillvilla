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
use App\Events\ChatCallAcceptedEvent;
use App\Events\ChatCallRestoreEvent;
use App\Events\SendMessageEvent;
use App\Events\ChatCallHoldEvent;
use App\Events\ChatCallSignalEvent;

use Exception;
use JWTAuth;
use Carbon\Carbon; 

class CallController extends Controller
{
	
		//function for get active if any
		function getActiveCall(Request $request)
		{
			try
			{
				// Get logged-in user
        $user = JWTAuth::parseToken()->authenticate();
				
				
				// Find an active call where user is caller or receiver
        $activeCall = Call::where(function ($query) use ($user) {
                $query->where('caller_id', $user->id)
                      ->orWhere('receiver_id', $user->id);
            })
            ->whereNotIn('status', ['ended', 'rejected', 'missed'])
            ->latest('created_at')
						->with([
							'caller:id,userID,name',
							'caller.customer:id,user_id,image',  
							'receiver:id,userID,name',
							'receiver.customer:id,user_id,image', 
							 
						])
            ->first();

        if (!$activeCall) {
            return response()->json([
                'status' => false,
                'message' => 'No active call found',
            ], 200);
        }
				
				
				// Check if the call is initiated and created more than 1 minute ago, then end the call mark as missed call
        if ($activeCall->status === 'initiated') {
            $callCreated = \Carbon\Carbon::parse($activeCall->created_at);
            $now = now();

            if ($callCreated->diffInSeconds($now) > 120) {
                // Auto-end the call
                $activeCall->status = 'missed';
                $activeCall->ended_at = $now;
                $activeCall->save();

                // (Optional) Dispatch missed event here if needed
                // CallMissedEvent::dispatch($activeCall);

                return response()->json([
                    'status' => false,
                    'message' => 'Call missed due to no response.',
                ], 200);
            }
        }


				//getting url of profile image of users
				if ($activeCall->caller->customer != null && !filter_var($activeCall->caller->customer->image, FILTER_VALIDATE_URL)) 
				{ 
					$activeCall->caller->customer->image = $activeCall->caller->customer->image
					? url(Storage::url('profile_image/' . $activeCall->caller->customer->image))  
					: null; 
				}	
				if ($activeCall->receiver->customer != null && !filter_var($activeCall->receiver->customer->image, FILTER_VALIDATE_URL)) 
				{ 
					$activeCall->receiver->customer->image = $activeCall->receiver->customer->image
					? url(Storage::url('profile_image/' . $activeCall->receiver->customer->image))  
					: null; 
				}	
				


				$messages = $activeCall->messages;
        $chatId = $messages->first()?->chat_list_id;
				
				 
				
				//dispatch event for call end
				if(  $activeCall->status === 'accepted')
				{
					$caller_id = $activeCall->caller_id;
					$receiver_id = $activeCall->receiver_id;

					$otherUserId = $user->id == $caller_id ? $receiver_id : $caller_id;

					ChatCallRestoreEvent::dispatch( $otherUserId , $activeCall->id, $user->id === $caller_id ); 
				}
				
				$data = [
					'chat_id' => $chatId,
					'call_id' => $activeCall->id,
					'call_status' => $activeCall->status,
					'call_type' => $activeCall->call_type,
					'started_at' => $activeCall->started_at, 
					'room_id' => $activeCall->room_id,
					'receiver_hold' => $activeCall->receiver_hold,
					'caller_hold' => $activeCall->caller_hold,
					'receiver'   => [
								'id'    => $activeCall->receiver->id,
								'name'  => $activeCall->receiver->name,
								'userID'  => $activeCall->receiver->userID,
								'image' => $activeCall->receiver->customer->image,
						],
						'caller'     => [
							'id'    => $activeCall->caller->id,
							'name'  => $activeCall->caller->name,
							'userID'  => $activeCall->caller->userID,
							'image' => $activeCall->caller->customer->image,
						],
					'is_receiver' => $user->id === $activeCall->receiver->id,
					'initiated_at' => $activeCall->created_at,
				];
        return response()->json([
            'status' => true,
            'data' => $data,
            
        ], 200);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
 
	
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
					'id'    => $call->id,
					'chatId'    => $chat_id,
					'room_id'    => $call->room_id,
					'call_type'  => $call->call_type,
					'caller'     => [
							'id'    => $call->caller->id,
							'name'  => $call->caller->name,
							'userID'  => $call->caller->userID,
							'image' => $call->caller->customer->image,
					],
					'receiver'   => [
								'id'    => $call->receiver->id,
								'name'  => $call->receiver->name,
								'userID'  => $call->receiver->userID,
								'image' => $call->receiver->customer->image,
						],
					'initiated_at' => $call->created_at,
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
						'initiated_at' => $call->created_at,
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
		
		
			//function for ending or rejecting call 
		function endOrRejectCall(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				 // Validate input
        $request->validate([
            'call_id' => 'required|integer|exists:calls,id',
            'chat_id' => 'required|integer|exists:chat_lists,id',
						'status' => 'required|string|in:ended,rejected,missed,busy',
        ]);
				
				 

        $chat_id = $request->chat_id;
				$status = strtolower($request->status);

				
        // Fetch the call
        $call = Call::findOrFail($request->call_id);

        // Ensure the user is part of the call (optional, for security)
        if ($call->caller_id !== $user->id && $call->receiver_id !== $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }
				
				//check  call is not already ended
				if ($call->status ===  'ended' || $call->status === 'missed') {
            return response()->json([
                'status' => false,
                'message' => 'Call is already ended.',
            ], 403);
        }
				
				// Update call status
        $call->status = $status;
        $call->ended_at = now(); // optional if you track end time
        $call->save();
				
				
				
				
				// Also create a message linked to the call
				$messageText = ucfirst($call->call_type) . ' Call ' . ucfirst($status);

				$message = new Message([
						'chat_list_id' => $chat_id,
						'sender_id' => $call->caller_id,
						'message' => $messageText,
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

				$otherUserId = $user->id == $caller_id ? $receiver_id : $caller_id;

				//dispatch event for call end
				ChatCallEndEvent::dispatch( $otherUserId , $call->id, $messageText ); 
				SendMessageEvent::dispatch( 
					 $newMessage 
				);
				
				// Return the posts as a JSON response
				$data = [
				'status' => true,
				'message'=> $messageText, 
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
				
				 // Validate input
        $request->validate([
            'call_id' => 'required|integer|exists:calls,id',
            
        ]);
				
				 

        
				
				 // Fetch the call
        $call = Call::findOrFail($request->call_id);

        // Ensure the user is part of the call (optional, for security)
        if ($call->receiver_id !== $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }
				
				 // Update call status
        $call->status = 'accepted';
				$call->started_at = now(); 
        $call->save();
				
				$caller_id = $call->caller_id;
				
				//dispatch event for call end
				ChatCallAcceptedEvent::dispatch( $caller_id , $call->id, $call->started_at ); 
				
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Call Accepted', 'startedAt'=> $call->started_at ]; 
				return response()->json($data);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		 
		//function for hold call 
		function holdCall(Request $request)
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
        if ($call->receiver_id !== $user->id && $call->caller_id !== $user->id) {
            return response()->json([
                'status' => false,
                'message' => 'Unauthorized action.',
            ], 403);
        }
				 
				$otherUserId = null;
				if ($call->caller_id === $user->id) 
				{
					$call->caller_hold = !$call->caller_hold;
					$otherUserId = $call->receiver_id; 
        } elseif ($call->receiver_id === $user->id) {
					$call->receiver_hold = !$call->receiver_hold;
					$otherUserId = $call->caller_id;
        }
        $call->save();
				 
				//dispatch event for call end
				ChatCallHoldEvent::dispatch( [
					'callId' => $call->id,
					'toUserId' => $otherUserId,
					'callerHold' => $call->caller_hold,
					'receiverHold' => $call->receiver_hold,
				]  ); 
				
				
				
				// Return the posts as a JSON response
				$data = [
					'status' => true,
					'message'=> 'update is hold.', 
					'caller_hold' => $call->caller_hold,
					'receiver_hold' => $call->receiver_hold,
					
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
		
		 
		
		
	
		
		//function for call signaling  
		function callSignal(Request $request)
		{
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$toUserId = $request->toUserId;
				$call_id = $request->call_id;
				$payload = $request->payload;
				$type = $request->type;
			 
				//dispatch event for call end
				ChatCallSignalEvent::dispatch( $toUserId , $call_id, $payload, $type  ); 
				
				
				
				// Return the posts as a JSON response
				$data = ['status' => true,   ]; 
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
