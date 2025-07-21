<?php

use App\Http\Controllers\Admin\AdminStoriesController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminStoriesController::class)->group(
				function (){
					
					//Route for getting story list
					 Route::post('get-story-list','getStoryList')->name('admin.getStoryList');
					 //route for getting story detail
					 Route::post('story-detail', 'getStoryDetail')->name('admin.getStoryDetail');
				}                                        
			);  
		