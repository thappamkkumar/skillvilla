<?php

use App\Http\Controllers\Admin\AdminWorkfolioController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminWorkfolioController::class)->group(
				function (){
					
					//Route for getting workfolio list
					 Route::post('get-workfolio-list','getWorkfolioList')->name('admin.getWorkfolioList');
				}                                        
			);  
		