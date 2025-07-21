<?php

use App\Http\Controllers\User\ChatController;
use Illuminate\Support\Facades\Route;

	   Route::controller(ChatController::class)->group(
			function (){
				//Route for fetching chat list
				Route::post('/get-chat-list', 'getChatList')->name('user.getChatList');
				//Route for get list of messsages or chat of logged user and other user or contact
				Route::post('/get-full-chat','getFullChat')->name('user.getFullChat');
				//Route for get new chat of logged user and other user or contact
				Route::post('/get-new-chat','getNewChat')->name('user.getNewChat');
				//Route for uplaod new message
				Route::post('upload-new-message', 'uploadNewMessage')->name('user.uploadNewMessage');
				//Route for download message attachment 
				Route::post('download-message-attachment', 'downloadMessageAttachment')->name('user.downloadMessageAttachment');
				//Route for delete message
				Route::post('delete-message', 'deleteMessage')->name('user.deleteMessage');
				//Route fur update read status of message
				Route::post('update-messsage-read-status', 'updateMessageReadStatus')->name('user.updateMessageReadStatus');
				//Route for create chat in chat list for logged user and other selected user-detail
				Route::post('create-chat', 'createChat')->name('user.createChat');
				
				//Route for delete chat
				Route::post('delete-chat', 'deleteChat')->name('user.deleteChat');
				
				//route for share  with users
				Route::post('/share-with-users', 'shareWithUser')->name('user.shareWithUser');
				
			}                                        
		);           
