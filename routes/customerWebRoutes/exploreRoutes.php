<?php

use App\Http\Controllers\User\ExploreController;
use Illuminate\Support\Facades\Route;

	   Route::controller(ExploreController::class)->group(
			function (){
			 
				//Route for fetching user  
				Route::post('/explore/user', 'getExploreUser')->name('user.getExploreUser');
				//Route for fetching post  
				Route::post('/explore/post', 'getExplorePost')->name('user.getExplorePost');
				//Route for fetching workfolio  
				Route::post('/explore/workfolio', 'getExploreWorkfolio')->name('user.getExploreWorkfolio');
				//Route for fetching job  
				Route::post('/explore/job', 'getExploreJob')->name('user.getExploreJob');
				//Route for fetching freelance  
				Route::post('/explore/freelance', 'getExploreFreelance')->name('user.getExploreFreelance');
				//Route for fetching problems  
				Route::post('/explore/problem', 'getExploreProblem')->name('user.getExploreProblem');
				//route for fetching communities
				Route::post('/explore/communities', 'getExploreCommunities')->name('user.getExploreCommunities');
				 
				
			}                                        
		);       
		