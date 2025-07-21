<?php

use App\Http\Controllers\User\StoriesController;
use Illuminate\Support\Facades\Route;

	  Route::controller(StoriesController::class)->group(
			function (){
				 //Route for uploading new stories
				Route::post('/add-new-stories', 'addNewStories')->name('user.addNewStories');
				//Route for fetch stories of followed 
				Route::post('/get-user-has-stories', 'getUserHasStories')->name('user.getUserHasStories');
				//Route for fetch stories of  user
				Route::post('/get-logged-user-stories', 'getLoggedUserStories')->name('user.getLoggedUserStories');
				//Route to get single story detail
				
				Route::post('/get-story-detail', 'getStoryDetail')->name('user.getStoryDetail');
			//Route to get all story detail
			 
				
				Route::post('delete-stories', 'deleteStories')->name('user.deleteStories');
				//Route for add like of stories
				Route::post('like-stories', 'likeStories')->name('user.likeStories');
				//Route for comment list
				Route::post('get-stories-comments', 'getStoriesComments')->name('user.getStoriesComments');
				//Route for comment list
				Route::post('upload-stories-comment', 'uploadStoriesComment')->name('user.uploadStoriesComment');
				 
			}                                        
		);    