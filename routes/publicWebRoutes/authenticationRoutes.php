<?php

use App\Http\Controllers\AuthenticationController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AuthenticationController::class)->group(
			function (){
				//Route for email verification and otp send
				Route::post('email-verfication-send-otp', 'emailVerificationSendOTP')->name('auth.emailVerificationSendOTP');
				//Route for verifying otp 
				Route::post('verifying-otp', 'verifyingOTP')->name('auth.verifyingOTP');
				//Route for send otp for forgot password
				Route::post('forgot-password-send-otp', 'forgotPasswordSendOTP')->name('auth.forgotPasswordSendOTP');
				//Route for forgot password
				Route::post('forgot-password', 'forgotPassword')->name('auth.forgotPassword');
				//Route for storing user data or user autherization
				Route::post('/store-user','storeUser')->name('auth.storeUser');
				//Route for authentication or login 
				Route::post('/login','login')->name('auth.login');
				//Route for admin authentication or login 
				Route::post('/admin-login','adminLogin')->name('auth.adminLogin');
				//Route for logout
				Route::post('/logout','logout')->name('auth.logout');
				//Route for check user authentication  
				Route::post('/check-user', 'checkUser')->name('auth.checkUser');
			}
		); 