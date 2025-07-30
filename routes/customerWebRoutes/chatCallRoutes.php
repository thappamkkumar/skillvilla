<?php

use App\Http\Controllers\User\CallController;
use Illuminate\Support\Facades\Route;

	   Route::controller(CallController::class)->group(
			function (){
				
				//Route for call initiate
				Route::post('/initiate-call', 'initiateCall')->name('user.initiateCall'); 
				
				//Route for end call 
				Route::post('/call/end-or-reject', 'endOrRejectCall' )->name('user.endOrRejectCall');
				
				
				//Route for accept call 
				Route::post('/accept-call', 'acceptCall' )->name('user.acceptCall');
				
				//Route for reject call 
				Route::post('/reject-call', 'rejectCall' )->name('user.rejectCall');
				
				
				//Route for  call sigal
				Route::post('/call-signal', 'callSignal' )->name('user.callSignal');
				
				//Route for   call  media
				Route::post('/call-media', 'callMedia' )->name('user.callMedia');
				
				
			}                                        
		);           
