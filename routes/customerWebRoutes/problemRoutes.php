<?php

use App\Http\Controllers\User\ProblemController;
use Illuminate\Support\Facades\Route;

	   Route::controller(ProblemController::class)->group(
			function (){
				//Route for uploading new  problem
				Route::post('/add-new-problem', 'addNewProblem')->name('user.addNewProblem');
				//Route for fetch problem of followed 
				Route::post('/get-interested-problems', 'getInterestedProblems')->name('user.getInterestedProblems');
				//Route for fetch problem of  user
				Route::post('/get-user-problems', 'getUserProblems')->name('user.getUserProblems');
				//Route for fetch problem detail
				Route::post('/get-problem-detail', 'getProblemDetail')->name('user.getProblemDetail');
				//Route for delete problem
				Route::post('delete-problem', 'deleteProblem')->name('user.deleteProblem');
				 //Route for download problem attachmnet
				Route::post('/download-problem-attachment', 'downloadProblemAttachment')->name('user.downloadProblemAttachment');
				
				//Route for add review for perticular workfolio
				Route::post('add-problem-solution', 'addProblemSolution')->name('user.addProblemSolution');
				//Route for  problem solution list
				Route::post('get-problem-solution', 'getProblemSolution')->name('user.getProblemSolution'); 
				//Route for  problem solution attachment
				Route::post('download-problem-solution-attachment', 'downloadProblemSolutionAttachment')->name('user.downloadProblemSolutionAttachment'); 
				//Route for delete problem solution  
				Route::post('delete-problem-solution', 'deleteProblemSolution')->name('user.deleteProblemSolution');
				//route for fetching saved problems
				Route::post('get-saved-problems', 'getSavedProblems')->name('user.getSavedProblems');
				//route for save and remove from save problem
				Route::post('save-problem', 'saveProblem')->name('user.saveProblem');
				 
			}                                        
		);  