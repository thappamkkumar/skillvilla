<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminDashboardController::class)->group(
				function (){
					
					//Route for upload new message in community
					 Route::post('get-dashboard-info', 'getDashboardInfo')->name('admin.getDashboardInfo');
				}                                        
			);  
		