<?php

use App\Http\Controllers\Admin\AdminCommunitiesController;
use Illuminate\Support\Facades\Route;

	  Route::controller(AdminCommunitiesController::class)->group(
				function (){
					
					//Route for upload new message in community
					 Route::post('get-community-list', 'getCommunityList')->name('admin.getCommunityList');
					 //Route for  community detail
					 Route::post('community-detail', 'getCommunityDetail')->name('admin.getCommunityDetail');
					 
				}                                        
			);  
		