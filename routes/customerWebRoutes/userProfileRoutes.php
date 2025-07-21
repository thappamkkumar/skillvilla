<?php

use App\Http\Controllers\User\UserProfileController;
use Illuminate\Support\Facades\Route;

	 
 Route::controller(UserProfileController::class)->group(
	function (){
		//Route for fetching user detail for user profile
		Route::post('/user-profile', 'getUserProfile')->name('user.getUserProfile');
		//Route for follow or unfollow the user-profile
		Route::post('/follow-user', 'followUser')->name('user.followUser');
		//Route for fetching follower list of user
		Route::post('follower-list', 'followerList')->name('user.followerList');
		//Route for fetching following list of user
		Route::post('following-list', 'followingList')->name('user.followingList');
		//Route for updating user profile image
		Route::post('update-user-profile-image', 'updateUserProfileImage')->name('user.updateUserProfileImage');
		//Route for updating user details like name,mobile_number,city_village,state,country
		Route::post('update-user-detail', 'updateUserDetail')->name('user.updateUserDetail');
		//Route for update userID
		Route::post('update-userID', 'updateUserID')->name('user.updateUserID');
		//Route for check email  and send email
		Route::post('/update-email-send-OTP', 'updateEmailSendOTP')->name('auth.updateEmailSendOTP'); 
		//Route for update email
		Route::post('update-email', 'updateEmail')->name('user.updateEmail');
		//Route for remove technology or skills
		Route::post('remove-interest', 'removeInterest')->name('user.removeInterest');
		//Route for add new technology or skills
		Route::post('add-interest', 'addInterest')->name('user.addInterest');
		//Route for check the current password for update password or password verification
		Route::post('verify-current-password', 'verifyCurrentPassword')->name('user.verifyCurrentPassword');
		//Route for  update password 
		Route::post('update-password', 'updatePassword')->name('user.updatePassword');
		
	}                                        
);    