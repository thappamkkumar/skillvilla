<?php

use App\Http\Controllers\User\WorkfolioController;
use Illuminate\Support\Facades\Route;

	   Route::controller(WorkfolioController::class)->group(
			function (){
				//Route for uploading new work in workfolio
				Route::post('/add-new-work', 'addNewWork')->name('user.addNewWork');
				//Route for fetch workfolio of followed 
				Route::post('/get-interested-workfolio', 'getInterestedWorkfolio')->name('user.getInterestedWorkfolio');
				//Route for fetch workfolio of  user
				Route::post('/get-user-workfolio', 'getUserWorkfolio')->name('user.getUserWorkfolio');
				//Route for fetch workfolio detail
				Route::post('/get-workfolio-detail', 'getWorkfolioDetail')->name('user.getWorkfolioDetail');
				//Route for download workfolio other files
				Route::post('/download-workfolio-other-file', 'downloadWorkfolioOtherFile')->name('user.downloadWorkfolioOtherFile');
				//Route for delete workfolio
				Route::post('delete-workfolio', 'deleteWorkfolio')->name('user.deleteWorkfolio');
				//Route for add review for perticular workfolio
				Route::post('add-workfolio-review', 'addWorkfolioReview')->name('user.addWorkfolioReview');
				//Route for  workfolio reviews list
				Route::post('get-workfolio-reviews', 'getWorkfolioReview')->name('user.getWorkfolioReview'); 
				//route for workfolio save
				Route::post('save-workfolio', 'saveWorkfolio')->name('user.saveWorkfolio');
				//route for fetching saved workfolio
				route::post('get-saved-workfolio', 'getSavedWorkfolio')->name('user.getSavedWorkfolio');

			}                                        
		);                                         
		