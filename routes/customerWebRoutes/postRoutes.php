<?php

use App\Http\Controllers\User\PostController;
use Illuminate\Support\Facades\Route;

	 
    Route::controller(PostController::class)->group(
			function (){
				//Route for fetching post list of  following user
				Route::post('/get-interested-post-list', 'getInterestedPostList')->name('user.getInterestedPostList');
				//Route for fetching post list of perticulllar user or logged user-detail
				Route::post('get-user-post-list', 'getUserPostList')->name('user.getUserPostList');
				//Route for get post Detail
				Route::post('/get-post-detail', 'getPostDetail')->name('user.getPostDetail');
				//Route for like or unlike the post
				Route::post('/like-post', 'likePost')->name('user.likePost');
				//Route for fetch comment on post 
				Route::post('/get-post-comment', 'getPostComment')->name('user.getPostComment');
				//upload new comment
				Route::post('/upload-post-comment', 'uploadPostComment')->name('user.uploadPostCommnet');
				//Route for save the post or remove post from save 
				Route::post('/save-post', 'savePost')->name('user.savePost');
				//Route for delete post
				Route::post('delete-post', 'deletePost')->name('user.deletePost');
				//Route for get tagged post-comment
				Route::post('get-tagged-post', 'getTaggedPost')->name('user.getTaggedPost');
				//Route for get saved post-comment
				Route::post('get-saved-post', 'getSavedPost')->name('user.getSavedPost');
				
				//Route for get project list of logged user for generating relation between the post and project
				//Route::post('get-user-project', 'getUserProject')->name('user.getUserProject');
				
				//Route for upload new post
				Route::post('upload-new-post', 'uploadNewPost')->name('user.uploadNewPost');
				//Route for fetching user list for post tags
				Route::post('/upload-new-post/get-user-list', 'getUserListForPostTag')->name('user.getUserListForPostTag');
				
				
			 
			}
		); 
