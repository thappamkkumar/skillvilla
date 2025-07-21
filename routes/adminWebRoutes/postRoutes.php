<?php

use App\Http\Controllers\Admin\AdminPostsController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminPostsController::class)->group(
				function (){
					
					//Route for getting post list
					 Route::post('get-post-list','getPostList')->name('admin.getPostList');
				}                                        
			);  
		