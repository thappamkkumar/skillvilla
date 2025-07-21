<?php

use App\Http\Controllers\User\CommunityMessagesController;
use Illuminate\Support\Facades\Route;

	  Route::controller(CommunityMessagesController::class)->group(
			function (){
				
				//Route for upload new message in community
				Route::post('/community/upload-new-message','uploadCommunityMessage')->name('user.uploadCommunityMessage');
				//Route for fetching community full chat
				Route::post('/community/get-full-chat','getCommunityMessages')->name('user.getCommunityMessages');
				//Route for downloading community message attachment
				Route::post('/community/download-message-attachment','downloadCommunityMessageAttachment')->name('user.downloadCommunityMessageAttachment');
				
				
			}                                        
		);  
		
		