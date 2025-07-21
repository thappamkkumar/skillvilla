<?php

use App\Http\Controllers\Admin\AdminProfileController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminProfileController::class)->group(
				function (){
					
					//Route for get admin profile
					Route::post('get-admin-profile', 'getAdminProfile')->name('admin.getAdminProfile');
					//Route for update profile image 
					Route::post('update-profile-image', 'updateProfileImage')->name('admin.updateProfileImage');
					//Route for update admin profile detail
					Route::post('update-profile-detail', 'updateProfileDetail')->name('admin.updateProfileDetail');
					 
				}                                        
			);  
		