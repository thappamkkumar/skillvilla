<?php

use App\Http\Controllers\Admin\AdminMessageController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminMessageController::class)->group(
				function (){
					
					//Route for get user message to admin
					Route::post('get-user-message-list', 'getUserMessages')->name('admin.getUserMessages');
					 
					//Route for delete message  
					Route::post('delete-user-message', 'deleteUserMessage')->name('admin.deleteUserMessage');
					
					//Route for reply to message by sending mail
					Route::post('send-reply-to-user-message', 'sendReplyToUserMessage')->name('admin.sendReplyToUserMessage');
				}                                        
			);  
		