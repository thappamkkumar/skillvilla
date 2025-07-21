<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

use App\Models\ContactMessage;

use App\Mail\MessageReply;

use JWTAuth;
use Mail;
use Exception;
class AdminMessageController extends Controller
{
    //function for get message send by users
		function getUserMessages(Request $request)
		{
			try
			{ 
				$messageList = ContactMessage::
				select('id', 'name', 'email', 'message', 'created_at') 
				->orderBy('id', 'desc')->cursorPaginate(25);
				
				
				return response()->json([
            'status' => true,
            'message' => 'Message list fetched successfully.',
            'messageList' => $messageList,
             
        ]);
				
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		} 
		
		
		//function for delete message
		function deleteUserMessage(Request $request)
		{
			try
			{ 
				$messageId = $request->id;
				// Try to find and delete the message
        $message = ContactMessage::find($messageId);

        if (!$message) {
            return response()->json([
                'status' => false,
                'message' => 'Message not found.',
            ]);
        }

        $message->delete(); // Delete the message

				return response()->json([
            'status' => true,
            'message' => 'Message deleted successfully.',
             
        ]);
				
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
		
		
		
		//function for send reply
		function sendReplyToUserMessage(Request $request)
		{
			 // Step 1: Validate input
        $validator = Validator::make($request->all(), [
            'reply' => 'required|string|max:5000',
            'email' => 'required|email',
            'name' => 'required|string|max:255',
           
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(),
            ], 422);
        }
				
				
			try
			{ 
				 $reply = trim($request->reply);
        $email = trim($request->email);
        $name = trim($request->name);
				$messageId = $request->messageId; 
				 
				Mail::to($email)->send(new MessageReply($name, $reply));	
				
				
				return response()->json([
            'status' => true,
            'message' => 'Reply send successfully.',
             
        ]);
				
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
		
		
		
}
