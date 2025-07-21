<?php

use App\Http\Controllers\Admin\AdminJobsController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminJobsController::class)->group(
				function (){
					
					//Route for  getting job list
					Route::post('get-job-list','getJobList')->name('admin.getJobList');
				}                                        
			);  
		