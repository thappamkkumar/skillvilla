<?php

use App\Http\Controllers\ContactMessageController;
use Illuminate\Support\Facades\Route;

	  Route::controller(ContactMessageController::class)->group(
			function (){
				//Route for email verification and otp send
				Route::post('/send-contact-message', 'sendContactMessage')->name('auth.sendContactMessage');
				 
			}
		); 