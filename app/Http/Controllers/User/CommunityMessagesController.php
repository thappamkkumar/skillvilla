<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;	
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Community; 
use App\Models\CommunityMessage; 

use App\Events\CommunityNewMessageEvent;

use JWTAuth;
use Exception;
use Carbon\Carbon;

class CommunityMessagesController extends Controller
{
    //function for get community messages
		function getCommunityMessages(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$communityId = $request->community_id;
        $communityDataRequired = $request->communityData;
				$data = [];
				
				// Get the  community data if needed
				if($communityDataRequired)
				{
					$communityData = Community::findOrFail($communityId);
					
					// Convert image paths to full URLs
					if (!filter_var($communityData->image, FILTER_VALIDATE_URL))  
					{				
						$communityData->image = $communityData->image
									? url(Storage::url('community_profile_image/' . $communityData->image))  
									: null;
					}
					$data['communityData'] = (object)$communityData->only(['id','name','image']);
				}
				
				// Now fetch the messages
				$messages = CommunityMessage::where('community_id', $communityId)
													->select('id', 'community_id', 'sender_id', 'message',   'attachment', 'created_at')
													->with([
														'sender:id,userID',
														'sender.customer:id,user_id,image', 
														
														])
													->orderBy('created_at', 'desc')  
													->cursorPaginate(50);
							
				if ($messages->isEmpty()) {
					$data['status'] = true;
					$data['message'] = 'No messages found.';
					$data['messageList'] = null;
					$data['next_cursor'] = null;
				} else {
					
						// Convert image paths to full URLs
					 foreach ($messages as $message) {
						if (!filter_var($message->sender->customer->image, FILTER_VALIDATE_URL))  
						{
							$message->sender->customer->image = $message->sender->customer->image
									? url(Storage::url('profile_image/' . $message->sender->customer->image))  
									: null;
						}
					} 
				
				
						$groupedMessages = $messages->groupBy(function($message) {
								// Format the date in a human-readable way (e.g., "Today", "Yesterday")
								$date = Carbon::parse($message->created_at);
								 return $date->format('d-m-Y');
								/*if ($date->isToday()) {
										return 'Today';
								} elseif ($date->isYesterday()) {
										return 'Yesterday';
								} else {
										return $date->format('Y-m-d');
								}*/
						});
						$data['status'] = true;
						$data['message'] = 'Chat List is ready.';
						$data['messageList'] = $groupedMessages;
						$data['next_cursor'] = $messages->nextCursor() != null ? $messages->nextCursor()->encode() : null;
				}
				
        return response()->json($data);			
				
				$data = ['status' => true,'message'=> 'Community message list is ready.',]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status'=>false, 'message'=>$e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for upload new community message
		function uploadCommunityMessage(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				// Create a new assignment
        $newMessage= new CommunityMessage();
        $newMessage->community_id = $request->communityId; 
        $newMessage->sender_id = $user->id; 
        $newMessage->message = $request->message;  
        $newMessage->save();
				
				// Handle file upload
        $attachmentFileName = null;
        if ($request->hasFile('attachment')) 
				{ 
					$attachmentFileName = $user->userID.'_community_message_attachment_file_'.$newMessage->id.'.'.$request->attachment->extension();
				//	$request->attachment->move(public_path('community_message_attachment/'), $attachmentFileName); 
					$request->file('attachment')->storeAs('community_message_attachment', $attachmentFileName, 'public');

        }
				
				$newMessage->attachment = $attachmentFileName;
        $newMessage->save();
				
				//load sender data
				 $newMessage->load([
												'sender:id,userID',
												'sender.customer:id,user_id,image',  
												]);
				
				//getting full url of profile image of sender
				if (!filter_var($newMessage->sender->customer->image, FILTER_VALIDATE_URL))  
				{
					$newMessage->sender->customer->image = $newMessage->sender->customer->image
							? url(Storage::url('profile_image/' . $newMessage->sender->customer->image))  
							: null;
				}
				
				
				//filter data for return
				$newMessage2 = $newMessage->only(['id', 'community_id', 'sender_id', 'message', 'attachment',  'created_at','human_readable_message_time', 'sender']);
				
				
						
				//formating created_at  for add message list on client side
				$date = Carbon::parse($newMessage2['created_at']);  
				$newMessage2['created_at'] =  $date->format('d-m-Y');
				
				//Dispatching event
				CommunityNewMessageEvent::dispatch( 
					 $newMessage2
				); 
				
				
				//formating created_at
				$date = Carbon::parse($newMessage2['created_at']);  
				$newMessage2['created_at'] =  $date->format('d-m-Y');

				
				$data = [
					'status' => true,
					'message'=> 'Community message is uploaded successfully.',
					'newMessage' => $newMessage2,
				]; 
					  
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status'=>false, 'message'=>$e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function  use to download message attachment 
		function downloadCommunityMessageAttachment(Request $request)
		{ 
			try
			{
				// fetch assignment detail
				$message = CommunityMessage::select('id', 'attachment')->findOrFail($request->id); 
				$filename =  $message->attachment;
				/*
				$filePath = public_path('community_message_attachment/' . $filename);

        // Check if file exists
        if (!file_exists($filePath)) {
            return abort(404, 'File not found');
        }
				
        // Return file as download
        return response()->download($filePath);*/
				
				$filePath = 'community_message_attachment/' . $filename;

				if (Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->download($filePath);
        } else {
            return response()->json(['error' => 'File not found'], 404);
        }
      }
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}  
		}


}
