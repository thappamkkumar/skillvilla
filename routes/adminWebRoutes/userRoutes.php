<?php

use App\Http\Controllers\Admin\AdminUserController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminUserController::class)->group(
				function (){
					
					//Route for getting user list
					 Route::post('/get-user-list','getUserList')->name('admin.getUserList');
					 //Route for updating is active status of user
					 Route::post('/update-user-active-status', 'updateUserActiveStatus')->name('admin.updateUserActiveStatus');
					 //route for fetching user profile
					 Route::post('/get-user-profile', 'getUserProfile')->name('admin.getUserProfile');
					 //route for delete user
					 Route::post('/delete-user', 'deleteUser')->name('admin.deleteUser');
				}                                        
			);  
		