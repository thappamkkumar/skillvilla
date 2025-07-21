<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;


use App\Events\UpdateMessageReadStatusEvent;
use App\Events\ChatDeleteEvent;
use App\Events\SendMessageEvent;
 
use App\Models\User; 
use App\Models\ChatList; 
use App\Models\Message;

use Carbon\Carbon; 
use JWTAuth;
use Exception;
class ChatController extends Controller
{
    //function use for get or fetch chat list
		function getChatList(Request $request)
		{
			try
			{
				
				// Authenticate the user using JWT if no search input is provided
				$user = JWTAuth::parseToken()->authenticate();
        
				$userId = $user->id;
			   $chatList = ChatList::where(function ($query) use ($userId) {
											$query->where('user_one_id', $userId)
														->orWhere('user_two_id', $userId);
									})
            ->select('id', 'user_one_id', 'user_two_id','updated_at')
						  ->with(['latestMessage' => function($query) {
                $query->select('id', 'chat_list_id','sender_id', 'message','attachment', 'post_id',	'workfolio_id',	'problem_id',	'company_job_id',	'freelance_id',		'stories_id',	'community_id',	'user_id',  'is_read', 'created_at');
            }])
						->orderBy('updated_at','desc')
					->cursorPaginate(20);
 

					
				 // Transform the collection to include truncated messages and add user data
            $chatList->getCollection()->transform(function ($chat) use ($userId){
                if ($chat->latestMessage) {
                    $chat->latestMessage->message = $chat->latestMessage->truncate_message;
                }
								
								 // Add the other user details to each chat
                $chat->chat_partner = $chat->getOtherUser($userId);
								//getting ful url of file
								if ($chat->chat_partner->customer != null && !filter_var($chat->chat_partner->customer->image, FILTER_VALIDATE_URL)) {
									$chat->chat_partner->customer->image = $chat->chat_partner->customer->image
											? url(Storage::url('profile_image/' . $chat->chat_partner->customer->image))
											: null;
								}
                return $chat;
            });
						
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Chat List is ready.', 'chatList'=>$chatList]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		//function to get new chat for reciver
		function getNewChat(Request $request)
		{
			try
			{
				// Authenticate the user using JWT if no search input is provided
				$user = JWTAuth::parseToken()->authenticate();
        
				$userId = $user->id;
				// Find the specific chat in the chat list
        $chat = ChatList::where('id', $request->chat_id) 
            ->select('id', 'user_one_id', 'user_two_id', 'updated_at')
            ->with(['latestMessage' => function ($query) {
                $query->select('id', 'chat_list_id', 'sender_id', 'message', 'attachment', 'is_read', 'created_at');
            }])
            ->firstOrFail(); // Retrieve the chat or throw a 404 if not found

        // Transform the chat to include truncated messages and add user data
        if ($chat->latestMessage) {
            $chat->latestMessage->message = $chat->latestMessage->truncate_message; // Ensure the truncate_message attribute exists
        }

        // Add the other user details
        $chat->chat_partner = $chat->getOtherUser($userId);
				//getting ful url of file
				if (!filter_var($chat->chat_partner->customer->image, FILTER_VALIDATE_URL)) {
					$chat->chat_partner->customer->image = $chat->chat_partner->customer->image
							? url(Storage::url('profile_image/' . $chat->chat_partner->customer->image))
							: null;
				}
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Chat is ready.', 'chat'=>$chat]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		//function to get all message or chat of logged user with perticular user-
		function getFullChat(Request $request)
		{
			try
			{ 
				 // Authenticate the user using JWT
        $user = JWTAuth::parseToken()->authenticate();
        $userId = $user->id;

        // Retrieve the chat ID from the request
        $chatId = $request->chat_id;
        $chatUserRequired = $request->chatUser;
				$data = [];
				
				
        // Update status of unread messages (sent by the other user) to 'read'
				$unReadedMessage = Message::select('id', 'sender_id', 'created_at')
								->where('chat_list_id', $chatId)
                ->where('sender_id', '!=', $userId) // Messages sent by the other user
                ->where('is_read', 0)              // Messages that are unread
								->get();
				if( $unReadedMessage->isNotEmpty())
				{
					Message::where('chat_list_id', $chatId)
                ->where('sender_id', '!=', $userId) // Messages sent by the other user
                ->where('is_read', 0)              // Messages that are unread
								->update(['is_read' => 1]);
					
					 // Group unread messages by formatted date
				 	$groupedUnReadedMessage = $unReadedMessage->map(function ($message) {
							$date = Carbon::parse($message->created_at);
							$message->formatted_date = $date->format('d-m-Y');
							return $message;
					})->groupBy('formatted_date'); 
					
						 
					//Dispatching event
					UpdateMessageReadStatusEvent::dispatch( 
						['chat_id' => $chatId, 'updatedData' =>$groupedUnReadedMessage ]
					); 
				
				}
				
				
				// Get the other user details that are chatting with the logged-in user
				if($chatUserRequired)
				{
					$chatUser = ChatList::findOrFail($chatId)->getOtherUser($userId);
					//getting ful url of file
					if (!filter_var($chatUser->customer->image, FILTER_VALIDATE_URL)) {
						$chatUser->customer->image = $chatUser->customer->image
								? url(Storage::url('profile_image/' . $chatUser->customer->image))
								: null;
					}
					$data['chatUser'] = 	$chatUser;
				}
        

				
        // Now fetch the messages after updating the unread ones
        $messages = Message::where('chat_list_id', $chatId)
									->select('id', 'chat_list_id', 'sender_id', 'message', 'is_read', 'attachment','post_id',	'workfolio_id',	'problem_id',	'company_job_id',	'freelance_id',		'stories_id',	'community_id',	'user_id',  'created_at')
									->with([
										'sharedUser:id,userID,name',//add shared user
										
										'sharedUser.customer:id,user_id,image',//add shared user customer detail
										 
										'sharedCommunity' => function ($query) use ($user) 
										{
											$query->select('id', 'name',   'image') 
											->withCount('members as community_member_count');
										}, //add shared community
										
										
										'sharedStory:id,user_id,story_file,created_at',//add shared community
										'sharedStory.user:id,name',//add shared community
										
										'sharedFreelance' => function ($query) use ($user) 
										{
											$query->select(
															'id', 'user_id', 'title', 'skill_required', 'deadline',
															'budget_min', 'budget_max', 'payment_type', 'created_at'
											) 
											->withExists(['savedFreelance as has_saved' => function ($query) use ($user) {
															$query->where('user_id', $user->id);
														}])
											->withExists(['bids as already_bid' => function ($query) use ($user) {
															$query->where('user_id', $user->id);
														}]) 
											->withCount('bids') 
											->with([
													'user:id,userID',
													'user.customer:id,user_id,image',
											]);
										},//add shared freelance
										
										'sharedJob' => function ($query) use ($user) 
										{
											$query->select(
															'id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  
											) 
											->with([  
												'company:id,name,logo',
												'user:id,userID',
												'user.customer:id,user_id,image',	
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
											}])
											->withCount('applications');
										},//add shared jobs
															
										 'sharedProblem' => function ($query) use ($user) 
										{
											$query->select('id', 'title',   'created_at', 'user_id')
											->with([
												'user:id,userID', 
												 'user.customer:id,user_id,image', 
											])
											->withCount('solutions') 
											->withExists(['savedProblem as has_saved' => function ($query) use ($user) {
												$query->where('user_id', $user->id);
											}]);
										},//add shared problem
										
										 
										
										'sharedWorkfolio' => function ($query) use ($user) 
										{
											$query->select('id', 'title',   'created_at', 'user_id')
											->with([
												'user:id,userID', 
												 'user.customer:id,user_id,image', 
											])
											->withAvg('workfolioReview', 'rating')
											->withCount('workfolioReview')
											->withExists(['savedWorkfolio as has_saved' => function ($query) use ($user) {
													$query->where('user_id', $user->id);
												}]);
										},//add shared workfolio
										
										'sharedPost' => function ($query) use ($user) 
										{
											$query->select('id', 'attachment',   'created_at', 'user_id')
											->with([
													'user:id,userID,name',
													'user.customer:id,user_id,image', 
													 
											])
											->withCount('likes') 
											->withExists(['likes as has_liked' => function ($query) use ($user) {
													$query->where('user_id', $user->id);
											}])
											->withExists(['saves as has_saved' => function ($query) use ($user) {
													$query->where('user_id', $user->id);
											}])
											->withCount('comments');
										},//add shared post
										 
										
									]) 
									->orderBy('created_at', 'desc')  
									->cursorPaginate(50);
								
			  
				 
				
				if ($messages->isEmpty()) {
					$data['status'] = true;
					$data['message'] = 'No messages found.';
					$data['messageList'] = null;
					$data['next_cursor'] = null;
				} 
				else 
				{  
					
						// Convert  file name  to full URLs
					  
						$messages->getCollection()->transform(function ($message) {

								// Shared user customer image URL
								if ($message->sharedUser && $message->sharedUser->customer) 
								{
										$image = $message->sharedUser->customer->image;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL) ) 
										{
												$path = 'profile_image/' . $image;  
												$message->sharedUser->customer->image = $message->sharedUser->customer->image ?  url(Storage::url($path)) : null;
										}
								}

								// Shared community image URL
								if ($message->sharedCommunity) 
								{
										$image = $message->sharedCommunity->image;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
										{ 
												$path = 'community_profile_image/' . $image; 
												$message->sharedCommunity->image = $message->sharedCommunity->image ?  url(Storage::url($path)) : null; 
										}
								}

								 // Shared story file thumnail URL
								if ($message->sharedStory) 
								{
										$storyFile= $message->sharedStory->story_file;
										$fileExtension = pathinfo($storyFile, PATHINFO_EXTENSION) ?? null;
										
										if($fileExtension == 'mp4')
										{
											$thumbnailFileName = pathinfo($storyFile, PATHINFO_FILENAME) . '.png';
										
											$message->sharedStory->story_file = url(Storage::url('stories_thumbnail/' . $thumbnailFileName)); 
										}
										else
										{
											if (!filter_var($storyFile, FILTER_VALIDATE_URL)) 
											{
												$message->sharedStory->story_file = $message->sharedStory->story_file
														? url(Storage::url('stories_file/' . $message->sharedStory->story_file))
														: null;
											} 
										} 
								}
								
								// Shared freelance owner profile image URL
								if ($message->sharedFreelance && $message->sharedFreelance->user && $message->sharedFreelance->user->customer) 
								{
										$image = $message->sharedFreelance->user->customer->image;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
										{ 
												$path = 'profile_image/' . $image; 
												$message->sharedFreelance->user->customer->image = $message->sharedFreelance->user->customer->image?  url(Storage::url($path)) : null; 
										}
								}
								
								// Shared job owner profile image URL
								if ($message->sharedJob && $message->sharedJob->user && $message->sharedJob->user->customer) 
								{
										$image = $message->sharedJob->user->customer->image;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
										{ 
												$path = 'profile_image/' . $image; 
												$message->sharedJob->user->customer->image = $message->sharedJob->user->customer->image?  url(Storage::url($path)) : null; 
										}
								}
								// Shared job company profile image URL
								if ($message->sharedJob && $message->sharedJob->company) 
								{
										$image = $message->sharedJob->company->logo;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
										{ 
												$message->sharedJob->company->logo = 'company_logo/' . $image; 
												$message->sharedJob->company->logo = $message->sharedJob->company->logo ?  url(Storage::url($path)) : null; 
										}
								}
								
								// Shared problem owner profile image URL
								if ($message->sharedProblem && $message->sharedProblem->user && $message->sharedProblem->user->customer) 
								{
										$image = $message->sharedProblem->user->customer->image;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
										{ 
												$path = 'profile_image/' . $image; 
												$message->sharedProblem->user->customer->image = $message->sharedProblem->user->customer->image?  url(Storage::url($path)) : null; 
										}
								}


								// Shared workfolio owner profile image URL
								if ($message->sharedWorkfolio && $message->sharedWorkfolio->user && $message->sharedWorkfolio->user->customer) 
								{
										$image = $message->sharedWorkfolio->user->customer->image;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
										{ 
												$path = 'profile_image/' . $image; 
												$message->sharedWorkfolio->user->customer->image = $message->sharedWorkfolio->user->customer->image?  url(Storage::url($path)) : null; 
										}
								}

								// Shared post owner profile image URL
								if ($message->sharedPost && $message->sharedPost->user && $message->sharedPost->user->customer) 
								{
										$image = $message->sharedPost->user->customer->image;
										if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
										{ 
												$path = 'profile_image/' . $image; 
												$message->sharedPost->user->customer->image = $message->sharedPost->user->customer->image?  url(Storage::url($path)) : null; 
										}
								}
							// Shared post attachment file
								if ($message->sharedPost ) 
								{
									
									$postFileExtension = !empty($message->sharedPost->attachment) && isset($message->sharedPost->attachment[0])  && is_string($message->sharedPost->attachment[0])
										? pathinfo($message->sharedPost->attachment[0], PATHINFO_EXTENSION) 
										: null;
									if($postFileExtension != null)
									{
										if (!filter_var($message->sharedPost->attachment[0], FILTER_VALIDATE_URL)) 
										{ 
											if($postFileExtension == 'mp4')
											{ 
												$thumbnailFileName = pathinfo($message->sharedPost->attachment[0], PATHINFO_FILENAME) . '.png';
												$message->sharedPost->attachment = url(Storage::url('post_video_thumbnail/' . $thumbnailFileName)); 
											}
											else
											{
												$message->sharedPost->attachment = $message->sharedPost->attachment[0]
												? url(Storage::url('post_image/' . $message->sharedPost->attachment[0])): null; 
														
											}
										}
									}
										 
								}




								return $message;
						});

					
					
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
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for upload new message
		function uploadNewMessage(Request $request)
		{
			try
			{
				// Authenticate the user using JWT
        $user = JWTAuth::parseToken()->authenticate();
				
				// Create a new assignment
        $newMessage= new Message();
        $newMessage->chat_list_id = $request->chatId; 
        $newMessage->sender_id = $user->id; 
        $newMessage->message =$request->input('message', '');
        $newMessage->post_id =$request->input('post_id', null);
        $newMessage->workfolio_id =$request->input('workfolio_id', null);
        $newMessage->problem_id =$request->input('problem_id', null);
        $newMessage->company_job_id =$request->input('company_job_id', null);
        $newMessage->freelance_id =$request->input('freelance_id', null);
        $newMessage->stories_id =$request->input('stories_id', null);
        $newMessage->community_id =$request->input('community_id', null);
        $newMessage->user_id =$request->input('user_id', null); 
        $newMessage->is_read = 0; 
        $newMessage->save();
				
				
				// Handle file upload
        $attachmentFileName = null;
        if ($request->hasFile('attachment')) 
				{ 
					$attachmentFileName = $user->userID.'_attachment_file_'.$newMessage->id.'.'.$request->attachment->extension();
					//$request->attachment->move(public_path('message_attachment/'), $attachmentFileName); 
					$request->file('attachment')->storeAs('message_attachment', $attachmentFileName, 'public');
        }
				
				$newMessage->attachment = $attachmentFileName;
        $newMessage->save();
				
				
				//update chatList updated_at  
				$chatList = ChatList::findOrFail($newMessage->chat_list_id);
				$chatList->touch(); // Updates the `updated_at` timestamp
 
 
 
				//filtering data
				$newMessage2 = $newMessage->only(['id', 'chat_list_id', 'sender_id', 'message', 'attachment','post_id',	'workfolio_id',	'problem_id',	'company_job_id',	'freelance_id',		'stories_id',	'community_id',	'user_id',  'is_read', 'created_at','human_readable_message_time']);
					
					
				// Fetch the related chat list
				$chatList = ChatList::findOrFail($request->chatId);

				// Determine the receiver's ID
				$receiver = $chatList->getOtherUser($user->id);
				
				//add receiver info
				$newMessage2['receiver_id'] = $receiver->id ?? null; // Assign receiver_id as an array key
				
				//formating created_at for add message list on client side
				$date = Carbon::parse($newMessage2['created_at']);  
				$newMessage2['created_at'] =  $date->format('d-m-Y');

				
					//Dispatching event
				SendMessageEvent::dispatch( 
					 $newMessage2
				); 
				
				// Return the messages and chat user as a JSON response
        $data = [
            'status' => true,
            'message' => 'Message is send successfully.',
            'newMessage' => $newMessage2,
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
		
	

		//function  use to download message attachment 
		function downloadMessageAttachment(Request $request)
		{ 
			try
			{
				// fetch assignment detail
				$message = Message::select('id', 'attachment')->findOrFail($request->id); 
				$filename =  $message->attachment;
				/*
				$filePath = public_path('message_attachment/' . $filename);

        // Check if file exists
        if (!file_exists($filePath)) {
            return abort(404, 'File not found');
        }

        // Return file as download
        return response()->download($filePath);
				*/
				
				$filePath = 'message_attachment/' . $filename;

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
		
		//function  use to delete message 
		function deleteMessage(Request $request)
		{ 
			try
			{
				// fetch message detail
				$message = Message::findOrFail($request->id); 
				
				if ($message->attachment) 
				{ 
					$filePath = 'message_attachment/' .  $message->attachment;
					if (Storage::disk('public')->exists($filePath)) {  
                Storage::disk('public')->delete($filePath);
					}
        }
        // Delete the assignment
       // $message->delete();
				
				//Dispatching event
				MessageDeleteEvent::dispatch( 
					[  
						'message_id'=>$request->id, 
					]
				); 
				
        $data = ['status' => true,'message'=> 'Message is deleted successfully.']; 
				return response()->json($data);
      }
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}  
		}
		
		//function for update message read status
		function updateMessageReadStatus(Request $request)
		{
			try
			{
				// fetch assignment detail
				$message = Message::findOrFail($request->id); 
				$message->update(['is_read' => 1]);
				
				$formattedDate = Carbon::parse($message->created_at)->format('d-m-Y');
				// Prepare grouped response
        $groupedMessages = [
            $formattedDate => [(object) $message->only(['id', 'sender_id', 'created_at'])]
        ];
					
						 
					 
				
				//Dispatching event
					UpdateMessageReadStatusEvent::dispatch( 
						['chat_id' => $message->chat_list_id, 'updatedData' =>$groupedMessages ] 
					); 
				
				
				$data = [
								'status' => true,
								'message'=> 'Message read status is updated successfully.',
								'data' => $groupedMessages,
				]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status'=>false, 'message' => 'Oops! Something went wrong'];
				$data = ['status'=> false, 'message' => $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for creating chat in chat list of logged user and other selected user
		function createChat(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$authUser = JWTAuth::parseToken()->authenticate();
				$userId = $request->user_id;
				
				if($userId == $authUser->id)
				{
					$dataData = [
					'status' => false,
					'message'=> 'Chat is not created because both user is same or not other user is found.', 
					]; 
					return response()->json($dataData);
				}
				
				// Check if a chat already exists between these users
				 $chat = ChatList::where(function ($query) use ($authUser, $userId) {
									$query->where('user_one_id', $authUser->id)->where('user_two_id', $userId);
							})
							->orWhere(function ($query) use ($authUser, $userId) {
									$query->where('user_one_id', $userId)->where('user_two_id', $authUser->id);
							})
							->first();
				
				
			 if (!$chat) {
							// Create a new chat if it does not exist
							$chat = ChatList::create([
									'user_one_id' => $authUser->id,
									'user_two_id' => $userId
							]);
					}
				 
		 
							

					
				
				// Return as a JSON response
				$data = [
				'status' => true,
				'message'=> 'Chat is created.',
				'chat_id'=>$chat->id, 	
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


		//function for  delete chat
		function deleteChat(Request $request)
		{
			try
			{
				// Authenticate the user using JWT if no search input is provided
				$user = JWTAuth::parseToken()->authenticate();
				
				$chatId = $request->chat_id;
				
				//get chat by id
				$chat = ChatList::findOrFail($chatId);
					 
				// Get all messages related to the chat
				$messages = Message::where('chat_list_id', $chatId)->get();

				// Loop through messages and delete attachments if they exist
				foreach ($messages as $message) {
					if ($message->attachment) {
									
						$filePath = 'message_attachment/' . $message->attachment;
						if (Storage::disk('public')->exists($filePath)) {  
									Storage::disk('public')->delete($filePath);
						}
						 
					}
				}

				// Delete messages related to the chat
				Message::where('chat_list_id', $chatId)->delete();

				// Delete the chat itself
				$chat->delete();
				
				ChatDeleteEvent::dispatch( 
						['chat_id' => $chatId, 'user_id'=>$user->id] 
					); 
				

				// Return as a JSON response
				$data = [
				'status' => true,
				'message'=> 'Chat is deleted successfully.', 
				]; 
				return response()->json($data);
					
			}
			catch(Exception $e)
			{
				//$data = ['status'=>false, 'message' => 'Oops! Something went wrong'];
				$data = ['status'=> false, 'message' => $e->getMessage()];
				return response()->json($data);
			}
		}
		
	
	
	//function for share with users
	function shareWithUser(Request $request)
	{
		try
		{
			
			// Retrieve the authenticated user from the JWT token
			$authUser = JWTAuth::parseToken()->authenticate();
			
			$shareId = $request->shareId;
			$shareType = $request->shareType;
			$selectedUsers = $request->selectedUsers;
			
			//loop through the selected user to check they have chat with logged user
	
			for($i = 0; $i < count($selectedUsers); $i++)
			{
				$userId =  $selectedUsers[$i]['id'];
				//Check if a chat already exists between these users
				$chat = ChatList::where(function ($query) use ($authUser, $userId) {
									$query->where('user_one_id', $authUser->id)->where('user_two_id', $userId);
							})
							->orWhere(function ($query) use ($authUser, $userId) {
									$query->where('user_one_id', $userId)->where('user_two_id', $authUser->id);
							})
							->first();
				
				
				if (!$chat) 
				{
							// Create a new chat if it does not exist
							$chat = ChatList::create([
									'user_one_id' => $authUser->id,
									'user_two_id' => $userId
							]);
						
				}
				
				// Create a new assignment
        $newMessage= new Message();
        $newMessage->chat_list_id = $chat->id; 
        $newMessage->sender_id = $authUser->id; 
        $newMessage->message ='';
        $newMessage->attachment = null;
				
        $newMessage->post_id = $shareType == 'post' ? $shareId : null;
        $newMessage->workfolio_id = $shareType == 'workfolio' ? $shareId : null;
        $newMessage->problem_id = $shareType == 'problem' ? $shareId : null;
        $newMessage->company_job_id = $shareType == 'job' ? $shareId : null;
        $newMessage->freelance_id = $shareType == 'freelance' ? $shareId : null;
        $newMessage->stories_id = $shareType == 'story' ? $shareId : null;
        $newMessage->community_id = $shareType == 'community' ? $shareId : null;
        $newMessage->user_id = $shareType == 'user' ? $shareId : null; 
				 
				 
        $newMessage->is_read = 0; 
        $newMessage->save();
				
				//update chatList updated_at  
				$chatList = ChatList::findOrFail($newMessage->chat_list_id);
				$chatList->touch(); // Updates the `updated_at` timestamp
 
 
				//load shared data
				$newMessage->load([
						'sharedUser:id,userID,name',//add shared user
						
						'sharedUser.customer:id,user_id,image',//add shared user customer detail
						 
						'sharedCommunity' => function ($query) 
						{
							$query->select('id', 'name',   'image') 
							->withCount('members as community_member_count');
						}, //add shared community
						
						
						'sharedStory:id,user_id,story_file,created_at',//add shared community
						'sharedStory.user:id,name',//add shared community
						
						'sharedFreelance' => function ($query) use ($authUser) 
						{
							$query->select(
											'id', 'user_id', 'title', 'skill_required', 'deadline',
											'budget_min', 'budget_max', 'payment_type', 'created_at'
							) 
							->withExists(['savedFreelance as has_saved' => function ($query) use ($authUser) {
											$query->where('user_id', $authUser->id);
										}])
							->withExists(['bids as already_bid' => function ($query) use ($authUser) {
											$query->where('user_id', $authUser->id);
										}]) 
							->withCount('bids') 
							->with([
									'user:id,userID',
									'user.customer:id,user_id,image',
							]);
						},//add shared freelance
						
						'sharedJob' => function ($query) use ($authUser) 
						{
							$query->select(
											'id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  
							) 
							->with([  
								'company:id,name,logo',
								'user:id,userID',
								'user.customer:id,user_id,image',	
								'attempts' => function ($query) use ($authUser) {
										$query->where('user_id', $authUser->id)
											->select('id','company_job_id','status'); 
								}
							])
							->withExists(['savedJobs as has_saved' => function ($query) use ($authUser) {
							$query->where('user_id', $authUser->id);
							}])
							->withExists(['applications as already_applied' => function ($query) use ($authUser) {
								$query->where('user_id', $authUser->id);
							}])
							->withCount('applications');
						},//add shared jobs
											
						 'sharedProblem' => function ($query) use ($authUser) 
						{
							$query->select('id', 'title',   'created_at', 'user_id')
							->with([
								'user:id,userID', 
								 'user.customer:id,user_id,image', 
							])
							->withCount('solutions') 
							->withExists(['savedProblem as has_saved' => function ($query) use ($authUser) {
								$query->where('user_id', $authUser->id);
							}]);
						},//add shared problem
						
						 
						
						'sharedWorkfolio' => function ($query) use ($authUser) 
						{
							$query->select('id', 'title',   'created_at', 'user_id')
							->with([
								'user:id,userID', 
								 'user.customer:id,user_id,image', 
							])
							->withAvg('workfolioReview', 'rating')
							->withCount('workfolioReview')
							->withExists(['savedWorkfolio as has_saved' => function ($query) use ($authUser) {
									$query->where('user_id', $authUser->id);
								}]);
						},//add shared workfolio
						
						'sharedPost' => function ($query) use ($authUser) 
						{
							$query->select('id', 'attachment',   'created_at', 'user_id')
							->with([
									'user:id,userID,name',
									'user.customer:id,user_id,image', 
									 
							])
							->withCount('likes') 
							->withExists(['likes as has_liked' => function ($query) use ($authUser) {
									$query->where('user_id', $authUser->id);
							}])
							->withExists(['saves as has_saved' => function ($query) use ($authUser) {
									$query->where('user_id', $authUser->id);
							}])
							->withCount('comments');
						},//add shared post
						
					]);
					
					
					// Shared user customer image URL
					if ($newMessage->sharedUser && $newMessage->sharedUser->customer) 
					{
							$image = $newMessage->sharedUser->customer->image;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL) ) 
							{
									$path = 'profile_image/' . $image;  
									$newMessage->sharedUser->customer->image = $newMessage->sharedUser->customer->image ?  url(Storage::url($path)) : null;
							}
					}

					// Shared community image URL
					if ($newMessage->sharedCommunity) 
					{
							$image = $newMessage->sharedCommunity->image;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
							{ 
									$path = 'community_profile_image/' . $image; 
									$newMessage->sharedCommunity->image = $newMessage->sharedCommunity->image ?  url(Storage::url($path)) : null; 
							}
					}

					 // Shared story file thumnail URL
					if ($newMessage->sharedStory) 
					{
							$storyFile= $newMessage->sharedStory->story_file;
							$fileExtension = pathinfo($storyFile, PATHINFO_EXTENSION) ?? null;
							
							if($fileExtension == 'mp4')
							{
								$thumbnailFileName = pathinfo($storyFile, PATHINFO_FILENAME) . '.png';
							
								$newMessage->sharedStory->story_file = url(Storage::url('stories_thumbnail/' . $thumbnailFileName)); 
							}
							else
							{
								if (!filter_var($storyFile, FILTER_VALIDATE_URL)) 
								{
									$newMessage->sharedStory->story_file = $newMessage->sharedStory->story_file
											? url(Storage::url('stories_file/' . $newMessage->sharedStory->story_file))
											: null;
								} 
							} 
					}
					
					// Shared freelance owner profile image URL
					if ($newMessage->sharedFreelance && $newMessage->sharedFreelance->user && $newMessage->sharedFreelance->user->customer) 
					{
							$image = $newMessage->sharedFreelance->user->customer->image;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
							{ 
									$path = 'profile_image/' . $image; 
									$newMessage->sharedFreelance->user->customer->image = $newMessage->sharedFreelance->user->customer->image?  url(Storage::url($path)) : null; 
							}
					}
					
					// Shared job owner profile image URL
					if ($newMessage->sharedJob && $newMessage->sharedJob->user && $newMessage->sharedJob->user->customer) 
					{
							$image = $newMessage->sharedJob->user->customer->image;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
							{ 
									$path = 'profile_image/' . $image; 
									$newMessage->sharedJob->user->customer->image = $newMessage->sharedJob->user->customer->image?  url(Storage::url($path)) : null; 
							}
					}
					// Shared job company profile image URL
					if ($newMessage->sharedJob && $newMessage->sharedJob->company) 
					{
							$image = $newMessage->sharedJob->company->logo;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
							{ 
									$newMessage->sharedJob->company->logo = 'company_logo/' . $image; 
									$newMessage->sharedJob->company->logo = $newMessage->sharedJob->company->logo ?  url(Storage::url($path)) : null; 
							}
					}
					
					// Shared problem owner profile image URL
					if ($newMessage->sharedProblem && $newMessage->sharedProblem->user && $newMessage->sharedProblem->user->customer) 
					{
							$image = $newMessage->sharedProblem->user->customer->image;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
							{ 
									$path = 'profile_image/' . $image; 
									$newMessage->sharedProblem->user->customer->image = $newMessage->sharedProblem->user->customer->image?  url(Storage::url($path)) : null; 
							}
					}


					// Shared workfolio owner profile image URL
					if ($newMessage->sharedWorkfolio && $newMessage->sharedWorkfolio->user && $newMessage->sharedWorkfolio->user->customer) 
					{
							$image = $newMessage->sharedWorkfolio->user->customer->image;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
							{ 
									$path = 'profile_image/' . $image; 
									$newMessage->sharedWorkfolio->user->customer->image = $newMessage->sharedWorkfolio->user->customer->image?  url(Storage::url($path)) : null; 
							}
					}

					// Shared post owner profile image URL
					if ($newMessage->sharedPost && $newMessage->sharedPost->user && $newMessage->sharedPost->user->customer) 
					{
							$image = $newMessage->sharedPost->user->customer->image;
							if ($image && !filter_var($image, FILTER_VALIDATE_URL)) 
							{ 
									$path = 'profile_image/' . $image; 
									$newMessage->sharedPost->user->customer->image = $newMessage->sharedPost->user->customer->image?  url(Storage::url($path)) : null; 
							}
					}
				// Shared post attachment file
					if ($newMessage->sharedPost ) 
					{
						
						$postFileExtension = !empty($newMessage->sharedPost->attachment) && isset($newMessage->sharedPost->attachment[0])  && is_string($newMessage->sharedPost->attachment[0])
							? pathinfo($newMessage->sharedPost->attachment[0], PATHINFO_EXTENSION) 
							: null;
						if($postFileExtension != null)
						{
							if (!filter_var($newMessage->sharedPost->attachment[0], FILTER_VALIDATE_URL)) 
							{ 
								if($postFileExtension == 'mp4')
								{ 
									$thumbnailFileName = pathinfo($newMessage->sharedPost->attachment[0], PATHINFO_FILENAME) . '.png';
									$newMessage->sharedPost->attachment = url(Storage::url('post_video_thumbnail/' . $thumbnailFileName)); 
								}
								else
								{
									$newMessage->sharedPost->attachment = $newMessage->sharedPost->attachment[0]
									? url(Storage::url('post_image/' . $newMessage->sharedPost->attachment[0])): null; 
											
								}
							}
						}
							 
					}

	
					
					
					
				//filtering data
			 $newMessage2 = [
				'id' => $newMessage->id,
				'chat_list_id' => $newMessage->chat_list_id,
				'sender_id' => $newMessage->sender_id,
				'message' => $newMessage->message,
				'attachment' => $newMessage->attachment,
				'post_id' => $newMessage->post_id,
				'workfolio_id' => $newMessage->workfolio_id,
				'problem_id' => $newMessage->problem_id,
				'company_job_id' => $newMessage->company_job_id,
				'freelance_id' => $newMessage->freelance_id,
				'stories_id' => $newMessage->stories_id,
				'community_id' => $newMessage->community_id,
				'user_id' => $newMessage->user_id,
				'is_read' => $newMessage->is_read,
				'created_at' => Carbon::parse($newMessage->created_at)->format('d-m-Y'),
				'human_readable_message_time' => $newMessage->human_readable_message_time,
				'shared_post' => $newMessage->sharedPost,
				'shared_job' => $newMessage->sharedJob,
				'shared_freelance' => $newMessage->sharedFreelance,
				'shared_community' => $newMessage->sharedCommunity,
				'shared_story' => $newMessage->sharedStory,
				'shared_problem' => $newMessage->sharedProblem,
				'shared_workfolio' => $newMessage->sharedWorkfolio,
				'shared_user' => $newMessage->sharedUser,
				];
 
					
					
				// Fetch the related chat list
				$chatList = ChatList::findOrFail($newMessage->chat_list_id);

				// Determine the receiver's ID
				$receiver = $chatList->getOtherUser($authUser->id);
				
				//add receiver info
				$newMessage2['receiver_id'] = $receiver->id ?? null; // Assign receiver_id as an array key
				
				//formating created_at for add message list on client side
				//$date = Carbon::parse($newMessage2['created_at']);  
				//$newMessage2['created_at'] =  $date->format('d-m-Y');

				
					//Dispatching event
				SendMessageEvent::dispatch( 
					 $newMessage2
				); 
				
				
			}

			
			// Return the response as a JSON response
			$data = ['status' => true,'message'=> $shareType.' has shared with users successfully.', ]; 
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
