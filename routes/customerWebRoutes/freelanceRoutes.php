<?php

use App\Http\Controllers\User\FreelanceController;
use Illuminate\Support\Facades\Route;

	   Route::controller(FreelanceController::class)->group(
			function (){
				//Route for uploading new freelance work
				Route::post('/add-new-freelance-work', 'addNewFreelanceWork')->name('user.addNewFreelanceWork');
				//Route for fetching list of freelance work of logged or perticular user
				Route::post('/get-user-freelance-work', 'getUserFreelanceWork')->name('user.getUserFreelanceWork');
				//Route for fetching list of freelance work of followed user
				Route::post('/get-interested-freelance-work', 'getInterestedFreelanceWork')->name('user.getInterestedFreelanceWork');
				//Route for fetching list of saved freelance work of logged user
				Route::post('/get-saved-freelance-work', 'getSavedFreelanceWork')->name('user.getSavedFreelanceWork');
				//Route for fetching list of applied  freelance work  
				Route::post('/get-applied-freelance-work', 'getAppliedFreelanceWork')->name('user.getAppliedFreelanceWork');
				
				
				//Route for delete freelance Work
				Route::post('/delete-freelance-work', 'deleteFreelanceWork')->name('user.deleteFreelanceWork');
				//Route for save freelance Work
				Route::post('/save-freelance-work', 'saveFreelanceWork')->name('user.saveFreelanceWork');
				//Route for get freelance Work for update
				Route::post('/get-freelance-work', 'getFreelanceWork')->name('user.getFreelanceWork');
				//Route for update or edit freelance Work 
				Route::post('/update-freelance-work', 'updateFreelanceWork')->name('user.updateFreelanceWork');
				//Route for get freelance Work  detail
				Route::post('/get-freelance-work-detail', 'getFreelanceWorkDetail')->name('user.getFreelanceWorkDetail');
				//Route for upload reviews on hirer
				Route::post('/upload-hirer-review', 'uploadHirerReview')->name('user.uploadHirerReview');
				
			}                                        
		);       
		