<?php

use App\Http\Controllers\User\FreelanceBidController;
use Illuminate\Support\Facades\Route;

	   Route::controller(FreelanceBidController::class)->group(
			function (){
			 
				//Route for add or place bid on freelance work or project
				Route::post('/place-bid-for-freelance-work', 'placeBidForFreelanceWork')->name('user.placeBidForFreelanceWork');
				//Route for fetching list of applied  freelance work  
				Route::post('/get-freelance-bids', 'getFreelanceBids')->name('user.getFreelanceBids');
				//Route for update freelance bid status
				Route::post('/update-freelance-bid-status', 'updateFreelanceBidStatus')->name('user.updateFreelanceBidStatus');
				//Route for upload reviews on freelancer
				Route::post('/upload-freelancer-review', 'uploadFreelancerReview')->name('user.uploadFreelancerReview');
				 
			}                                        
		); 