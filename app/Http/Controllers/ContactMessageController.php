<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\ContactMessage;

use Mail;
use Exception;


class ContactMessageController extends Controller
{
    //function for send cottact message
		function sendContactMessage(Request $request)
		{
			
			$validator = Validator::make($request->all(), [
					'name' => 'required|string|max:255',
					'email' => 'required|email|max:255',
					'message' => 'required|string',
			]);
			if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => $validator->errors()->first(), // Send only the first error
            ]);
        }
					
			try {
				  
				ContactMessage::create([
					'name'=>$request->name,
					'email'=>$request->email,
					'message'=> $request->message, 
					]);
        return response()->json(['status' => true, 'message' => 'Message sent successfully.',]);
			} 
			catch (Exception $e)
			{
        // Return error response for any exceptions
        $data = ['status' => false,'message'=> 'Oops! Something went wrong. Please try again later.'];
			//	$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);;
			}
			
			
		}
}
