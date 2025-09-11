<?php

 use App\Http\Controllers\User\LiveStreamController;
 use Illuminate\Support\Facades\Route;
 
 Route::controller(LiveStreamController::class)->group(
	function(){
		
		//Route for live stream start or initiate
		//Route::post('live-Stream-start', 'liveStreamStart')->name->('user.liveStreamStart');
		
	}
 );
 