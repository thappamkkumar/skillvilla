<?php

use App\Http\Controllers\Admin\AdminProblemController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminProblemController::class)->group(
				function (){
					
					//Route for getting post list
					 Route::post('get-problem-list','getPromblemList')->name('admin.getPromblemList');
				}                                        
			);  
		