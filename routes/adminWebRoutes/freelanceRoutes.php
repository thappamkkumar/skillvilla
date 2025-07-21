<?php

use App\Http\Controllers\Admin\AdminFreelanceController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminFreelanceController::class)->group(
				function (){
					
					//Route for  getting freelance list
					Route::post('get-freelance-list','getFreelanceList')->name('admin.getFreelanceList');
				}                                        
			);  
		