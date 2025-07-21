<?php

use App\Http\Controllers\User\CompanyJobVacancy;
use Illuminate\Support\Facades\Route;

	  Route::controller(CompanyJobVacancy::class)->group(
			function (){
				//Route for checking company  registeration is done or not
				Route::post('/check-company-registeration', 'checkCompanyRegisteration')->name('user.checkCompanyRegisteration');
				 	//Route for uploading new job vacancy
				Route::post('/add-new-job-vacancy', 'addNewJobVacancy')->name('user.addNewJobVacancy');
				//Route for get freelance Work for update
				Route::post('/get-job-vacancy', 'getJobVacancy')->name('user.getJobVacancy');
				//Route for update or edit freelance Work 
				Route::post('/update-job-vacancy', 'updateJobVacancy')->name('user.updateJobVacancy');
			
				
				//Route for  job vacancy data for adding new question for job test
				Route::post('/get-job-vacancy-data-for-adding-question', 'getJobVacancyDataForAddingQuestion')->name('user.getJobVacancyDataForAddingQuestion');
				//Route for adding   job vacancy questions
				Route::post('/add-job-vacancy-question', 'addJobVacancyQuestion')->name('user.addJobVacancyQuestion');
				//Route for update job test time limit 
				Route::post('/update-job-test-time-limit', 'updateJobTestTimeLimit')->name('user.updateJobTestTimeLimit');
				
				
				
				//Route for fetch jobs of followed user
				Route::post('/get-interested-job-vacancies', 'getInterestedJobVacancies')->name('user.getInterestedJobVacancies');
				//Route for fetch job vacancies of  user
				Route::post('/get-user-job-vacancies', 'getUserJobVacancies')->name('user.getUserJobVacancies');
				//Route for fetch applied job vacancies of  user
				Route::post('/get-applied-job-vacancies', 'getAppliedJobVacancies')->name('user.getAppliedJobVacancies');
				//Route for fetch saved job vacancies of  user
				Route::post('/get-saved-job-vacancies', 'getSavedJobVacancies')->name('user.getSavedJobVacancies');
				//Route for fetch job vacancy detail
				Route::post('/get-job-vacancy-detail', 'getJobVacancyDetail')->name('user.getJobVacancyDetail');
				//Route for delete  Job Vacancy 
				Route::post('delete-job-vacancy', 'deleteJobVacancy')->name('user.deleteJobVacancy');
				//Route for save  Job Vacancy 
				Route::post('save-job-vacancy', 'saveJobVacancy')->name('user.saveJobVacancy');
				
				//Route for fetch saved job vacancies of  user
				Route::post('/get-job-applications', 'getJobApplications')->name('user.getJobApplications');
				//Route for fetch job vacancy detail
				Route::post('/get-job-application-detail', 'getJobApplicationDetail')->name('user.getJobApplicationDetail');
				//Route for checking user has attempt test or applied job if not then return test questions
				Route::post('/apply-job/check', 'checkApplicationStatus')->name('user.checkApplicationStatus');
				//Route for uploading or submitting job test attempt
				Route::post('/upload/job-test/attempt','UploadJobTestAttempt')->name('user.UploadJobTestAttempt');
				//Route for uploading or submitting job application
				Route::post('/upload-job-application','UploadJobApplication')->name('user.UploadJobApplication');
				//Route for update job application status
				Route::post('/update-job-application-status', 'updateJobApplicationStatus')->name('user.updateJobApplicationStatus');
				//Route for download resume
				Route::post('/download-resume', 'downloadResume')->name('user.downloadResume');
				
			}                                        
		); 