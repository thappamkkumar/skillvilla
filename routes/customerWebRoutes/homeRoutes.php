<?php

use App\Http\Controllers\User\HomeController;
use Illuminate\Support\Facades\Route;

	   Route::controller(HomeController::class)->group(
			function ()
			{
				//Route for fetching feed
				Route::post('/get-feeds', 'getFeed')->name('user.getFeed');
			
			}                                        
		);           
