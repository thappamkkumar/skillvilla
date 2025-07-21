<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

 
use App\Models\CompanyJob; 
use App\Models\CompanyJobTestQuestion; 
use App\Models\CompanyJobTestQuestionOption; 
use App\Models\CompanyJobSave; 
use App\Models\CompanyJobApplication; 
use App\Models\CompanyJobTestAttempt; 
 
use App\Events\AddNewJobEvent; 
use App\Events\JobDeleteEvent; 
use App\Events\AddNewJobApplicationEvent; 
use App\Events\JobApplicationCountEvent; 


use JWTAuth;
use Exception;

class CompanyJobVacancy extends Controller
{
   
		//functiopn to  check Company Registeration
		function checkCompanyRegisteration(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					$company = $user->company()->exists()
            ? $user->company()->select(['id', 'name', 'logo','website'])->first()
            : null;
						
						
					//getting full  url of logo
					if($company)
					{
						$company->logo = $company->logo
						? url(Storage::url('company_logo/' . $company->logo))  
						: null;		
					}
				
				
					$data = ['status' => true, 'company'=> $company ]; 
					
					/*if($user->company) 
					{
						$data['hasCompany'] = true;
					} 
					else 
					{
								$data['hasCompany'] = false;
					}*/
					
				 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
	
	 
	
	
		//functiopn to add new job vacancy
		function addNewJobVacancy(Request $request)
		{
			  $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'salary' => 'required|string',
            'payment_type' => 'required|string',
            'job_location' => 'required|string',
            'employment_type' => 'required|string|in:full_time,part_time,internship,contract',
            'expires_at' => 'required|date|after:today',
            'skill_required' => 'nullable|array', // Make sure it's an array
            'skill_required.*' => 'nullable|string', // Each item in the array should be a string
            'email' => 'required|email',
            'phone' => 'required|string',
            'work_from_home' => 'required|boolean', // Boolean value (true/false)
            'communication_language' => 'required|string', // The language should be a string
        ]);
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
				 // Validate the incoming request data
       

        // Create a new job vacancy
         $newJob = new CompanyJob();
        $newJob->user_id = $user->id; // Authenticated user
        $newJob->company_id = $user->company->id; // Make sure the company exists or is passed
        $newJob->title = $request->input('title');
        $newJob->description = $request->input('description');
        $newJob->salary = $request->input('salary');
        $newJob->payment_type = $request->input('payment_type');
        $newJob->job_location = $request->input('job_location');
        $newJob->employment_type = $request->input('employment_type');
        $newJob->expires_at = $request->input('expires_at');
        $newJob->skill_required =   $request->input('skill_required', []); // Save skills as a comma-separated string
        $newJob->email = $request->input('email');
        $newJob->phone = $request->input('phone');
        $newJob->work_from_home = $request->input('work_from_home');
        $newJob->communication_language = $request->input('communication_language');
        
        // Save the new job vacancy
        $newJob->save();
			
				// Dynamically load additional relationships and aggregates
        $newJob->load([
            'company:id,name,logo',
            'attempts' => function ($query) use ($user) {
                $query->where('user_id', $user->id)->select('id','company_job_id','status');
            }
        ])
        ->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }])
        ->withExists(['applications as already_applied' => function ($query) use ($user) {
            $query->where('user_id', $user->id);
        }]);
				
				//getting full  url of company logo
					$newJob->company->logo = $newJob->company->logo
					? url(Storage::url('company_logo/' . $newJob->company->logo))  
					: null;		
				
				//getting rady data to return
        $newJobData = $newJob->only([
            'id', 'user_id', 'company_id', 'title', 'salary', 'payment_type', 'job_location',
            'employment_type', 'skill_required', 'work_from_home', 'expires_at', 'created_at','created_at_human_readable'
        ]);
        $newJobData['has_saved'] = $newJob->has_saved;
        $newJobData['already_applied'] = $newJob->already_applied;
        $newJobData['company'] = $newJob->company;
        $newJobData['attempts'] = $newJob->attempts;

				//dispach event for real time updation
					AddNewJobEvent::dispatch($newJobData);
				 	 
				
				// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Job vacancy added successfully.','newJob'=>$newJobData  ]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		//function for get job data for updation
		function getJobVacancy(Request $request)
		{
			
			
				
			try
			{
				// Retrieve the authenticated user from the JWT token
				//	$user = JWTAuth::parseToken()->authenticate();
				
				$job = CompanyJob::findOrFail($request->job_id);
			 
				 
				$jobData = $job->only([
				'id',
				'title', 
				'description', 
				'salary',  
				'payment_type', 
				'job_location', 
				'employment_type', 
				'expires_at', 
				'skill_required', 
				'email', 
				'phone', 
				'work_from_home',
				'communication_language', 
				'created_at'
				]);
					 
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Job Vacancy is ready for upadation.', 'jobData'=>$jobData]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	

		// fucntion for update job vacancy
		function updateJobVacancy(Request $request)
		{
			
			$request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'salary' => 'required|string',
            'payment_type' => 'required|string',
            'job_location' => 'required|string',
            'employment_type' => 'required|string|in:full_time,part_time,internship,contract',
            'expires_at' => 'required|date|after:today',
            'skill_required' => 'nullable|array', // Make sure it's an array
            'skill_required.*' => 'nullable|string', // Each item in the array should be a string
            'email' => 'required|email',
            'phone' => 'required|string',
            'work_from_home' => 'required|boolean', // Boolean value (true/false)
            'communication_language' => 'required|string', // The language should be a string
        ]);
				
			try
			{
				 //fetch job first to update
				$job = CompanyJob::findOrFail($request->id);
			 
				 // Update the job   fields
        $job->update([
            'title' => $request->title,
            'description' => $request->description,
            'salary' => $request->salary,
            'payment_type' => $request->payment_type,
            'job_location' => $request->job_location,
            'employment_type' => $request->employment_type,
            'expires_at' => $request->expires_at, 
            'skill_required' => $request->input('skill_required', []), 
            'email' => $request->email,
            'phone' => $request->phone,
            'work_from_home' => $request->work_from_home,
            'communication_language' => $request->communication_language,
						 
        ]);
				
				 
				// Dynamically load additional relationships and aggregates
				$job->load([
					'company:id,name,logo',
					 
        ]);
        
				//getting full  url of logo
				$job->company->logo = $job->company->logo
					? url(Storage::url('company_logo/' . $job->company->logo))  
					: null;		
				
        $updatedJobData = $job->only([
            'id', 'user_id', 'company_id', 'title', 'salary', 'payment_type', 'job_location',
            'employment_type', 'skill_required', 'work_from_home', 'expires_at', 'created_at', 'created_at_human_readable'
        ]);
        $updatedJobData['company'] = $job->company;
 
				
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Job Vacancy is ready for upadation.', 'updatedJobData'=>$updatedJobData]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		



		//function for fetching job vacancy data for adding new question for job test
		function getJobVacancyDataForAddingQuestion(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					$company = $user->company()->exists()
            ? $user->company()->select(['id', 'name', 'logo','website'])->first()
            : null;
					
					
					$jobData = CompanyJob::select('id',  'title','time_limit','expires_at', 'created_at') 
					->findOrFail($request->job_id); 

					//getting full  url of logo
					$company->logo = $company->logo
					? url(Storage::url('company_logo/' . $company->logo))  
					: null;		
				

					$data = ['status' => true, 'company'=> $company, 'jobData'=>$jobData ]; 
				 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		



		//function for update jot test time limit
		function updateJobTestTimeLimit(Request $request)
		{
			$validatedData = $request->validate([
        'time_limit' => 'required|integer|min:1|max:60', 
			]); 
			
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					 
					 // Find the job by ID
					$job = CompanyJob::findOrFail($request->job_id);

					// Check if the authenticated user is the owner of the job (or has the right permissions)
					if ($job->user_id != $user->id) {
							return response()->json(['status' => false, 'message' => 'Unauthorized'], 403);
					}

					// Update the time limit for the job
					$job->time_limit = $request->time_limit;
					$job->save();

					 

					$data = ['status' => true,  'message'=>'Time limit is updated successfully', ]; 
				 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}




		//function for add job vacancy question for test
		function addJobVacancyQuestion(Request $request)
		{
			$validatedData = $request->validate([
        'job_id' => 'required|integer|exists:company_jobs,id',  
        'question' => 'required|string',    
        'options' => 'required|array',
				'options.*' => 'required|string',
        'correctAnswer' => 'required|in:option1,option2,option3,option4' , 
			]);
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					 
					 
					// Save the question
        $question = CompanyJobTestQuestion::create([
            'company_job_id' => $request->job_id,
            'question' => $request->question, 
        ]);

        // Save the options
        foreach ($request->options as $index => $option) {
            $question->options()->create([
                'option' => $option,
                'is_correct' => $index == $request->correctAnswer,
            ]);
        }
				
				$data = ['status' => true, 'message'=>'Question is add successfully.']; 
				 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		 
	
	//function for  fetching following user jobs
		function getInterestedJobVacancies(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				// Retrieve the IDs of the users whom the authenticated user is following
				$followingIds = $user->following()->pluck('following_id');
				
				$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
				
				 $jobs = CompanyJob::select('id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  )
					 
					->whereNotNull('expires_at')
					->where('expires_at','>', now())
					->where('user_id', '!=', $user->id) // Ensure user does not see their own posts
					->where(function ($query) use ($userInterests, $followingIds) {
						if (!empty($userInterests)) {
							foreach ($userInterests as $interest) {
								$query->orWhereJsonContains('skill_required', $interest);
							}
						}

						if (!$followingIds->isEmpty()) {
							$query->orWhereIn('user_id', $followingIds);
						}
					})
					
					->with([  
							'user:id,userID',
							'user.customer:id,user_id,image',							
							'company:id,name,logo',
							'attempts' => function ($query) use ($user) {
									$query->where('user_id', $user->id)
										->select('id','company_job_id','status'); 
							},
						 						
					]) 
					->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
					->withExists(['applications as already_applied' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
					->orderBy('id', 'desc')->cursorPaginate(10); 
					 
			  
				foreach ($jobs as $job) 
				{
					//getting full profile image url of owner
					if (!filter_var($job->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				 
						$job->user->customer->image = $job->user->customer->image
						? url(Storage::url('profile_image/' . $job->user->customer->image))  
						: null;
					}
					
					//getting full  url of logo
					if (!filter_var($job->company->logo, FILTER_VALIDATE_URL)) 
					{ 
						$job->company->logo = $job->company->logo
						? url(Storage::url('company_logo/' . $job->company->logo))  
						: null;		
					} 
				} 
				
				// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Job List of user is ready.', 'jobList'=>$jobs]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		
		//function for fetching logged user or any specific user jobs
		function getUserJobVacancies(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
				
					$user_id = null;
					if($request->userId == null)
					{
						$user_id = $user->id;
					}
					else
					{
						$user_id = $request->userId;
					}
					 
				 $jobsQuery = CompanyJob::select('id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  )
					->where('user_id', $user_id);
					
					// If not logged user then filter use expires_at > now 
						if ($request->userId) {
								$jobsQuery->whereNotNull('expires_at')->where('expires_at','>', now())
								->with([  
								'user:id,userID,name',
								'user.customer:id,user_id,image',
								'company:id,name,logo',
								'attempts' => function ($query) use ($user) {
										$query->where('user_id', $user->id)
											->select('id','company_job_id','status'); 
								}	,	
						 								
							])->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
								$query->where('user_id', $user->id);
								}])
								->withExists(['applications as already_applied' => function ($query) use ($user) {
									$query->where('user_id', $user->id);
								}]);
						}
						else{
							
							$jobsQuery->with([  
							'user:id,userID,name',
							'user.customer:id,user_id,image',
							'company:id,name,logo',
							 
							])->withCount('applications');
							
						}
					 $jobs = $jobsQuery->orderBy('id', 'desc')->cursorPaginate(10); 
					/*
					// Add the total applications count for each job
					 foreach ($jobs as $job) {
							 
							$job->applications_count = $job->applications()->count();
					}
				*/
				
				foreach ($jobs as $job) 
				{ 
					//getting full profile image url of owner
					if (!filter_var($job->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				 
						$job->user->customer->image = $job->user->customer->image
						? url(Storage::url('profile_image/' . $job->user->customer->image))  
						: null;
					}
					
					//getting full  url of logo
					if (!filter_var($job->company->logo, FILTER_VALIDATE_URL)) 
					{ 
						$job->company->logo = $job->company->logo
						? url(Storage::url('company_logo/' . $job->company->logo))  
						: null;		
					} 
				} 
					
					
					
					
					// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Job List of user is ready.', 'jobList'=>$jobs]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		//function for fetching applied jobs
		function getAppliedJobVacancies(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
				 
					 
				 $jobs = CompanyJob::select('id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  )
					->whereHas('applications', function ($query) use ($user) {
                // Filter jobs that the user has applied for
                $query->where('user_id', $user->id);
            })
					->with([  
							'company:id,name,logo',
							'user:id,userID',
							'user.customer:id,user_id,image',
							'applications'=> function ($query) use ($user) {
									$query->where('user_id', $user->id)
											 ->select('id','company_job_id','status','created_at'); 
							}						 				
					]) 
					->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}]) 
					->withExists(['applications as already_applied' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}]) 
					->orderBy('id', 'desc')->cursorPaginate(10); 
					 
					 
					 
					foreach ($jobs as $job) 
					{
						//getting full profile image url of owner
						if (!filter_var($job->user->customer->image, FILTER_VALIDATE_URL)) 
						{ 				 
							$job->user->customer->image = $job->user->customer->image
							? url(Storage::url('profile_image/' . $job->user->customer->image))  
							: null;
						}
						
						//getting full  url of logo
						if (!filter_var($job->company->logo, FILTER_VALIDATE_URL)) 
						{ 
							$job->company->logo = $job->company->logo
							? url(Storage::url('company_logo/' . $job->company->logo))  
							: null;		
						} 
					} 
	 
					
					// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Job List of user is ready.', 'jobList'=>$jobs]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	

		//function for fetching saved jobs
		function getSavedJobVacancies(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
				 
					 
				 $jobs = CompanyJob::select('id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  ) 
				 ->whereHas('savedJobs', function ($query) use ($user) {
                        $query->where('user_id', $user->id); // Filter by saved jobs
                    
            })
					->with([  
							'user:id,userID,name',
							'user.customer:id,user_id,image',							
							'company:id,name,logo',
						  'attempts' => function ($query) use ($user) {
											$query->where('user_id', $user->id)
										->select('id','company_job_id','status');
									},
					]) 
					->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
					->withExists(['applications as already_applied' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
					->orderBy('id', 'desc')->cursorPaginate(10); 
					 
					foreach ($jobs as $job) 
					{
						//getting full profile image url of owner
						if (!filter_var($job->user->customer->image, FILTER_VALIDATE_URL)) 
						{ 				 
							$job->user->customer->image = $job->user->customer->image
							? url(Storage::url('profile_image/' . $job->user->customer->image))  
							: null;
						}
						
						//getting full  url of logo
						if (!filter_var($job->company->logo, FILTER_VALIDATE_URL)) 
						{ 
							$job->company->logo = $job->company->logo
							? url(Storage::url('company_logo/' . $job->company->logo))  
							: null;		
						} 
					} 
	 
					
					// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Job List of user is ready.', 'jobList'=>$jobs]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for fetching job detail
		function getJobVacancyDetail(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				 
				 // Find the job using the provided job_id or fail
        $job = CompanyJob::select(
                'id', 'user_id', 'company_id', 'title', 'description', 
                'salary', 'payment_type', 'job_location', 'employment_type', 'expires_at', 
                'skill_required', 'email', 'phone', 'work_from_home', 'communication_language', 'created_at', 'time_limit' 
            ) 
						->with([ 
								'user:id,userID,name',
								'user.customer:id,user_id,image',   
                'company:id,name,website,logo', 
                 'attempts' => function ($query) use ($user) {
											$query->where('user_id', $user->id)
										->select('id','company_job_id','status');
									},
									'applications'=> function ($query) use ($user) {
									$query->where('user_id', $user->id)
											 ->select('id','company_job_id','status','created_at'); 
							}	
            ]) 
						->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->withExists(['applications as already_applied' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
						->withCount('applications') 
            ->findOrFail($request->job_id); 
				 
				  
					//getting full profile image url of owner
					if (!filter_var($job->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				 
						$job->user->customer->image = $job->user->customer->image
						? url(Storage::url('profile_image/' . $job->user->customer->image))  
						: null;
					}
					
					//getting full  url of logo
					if (!filter_var($job->company->logo, FILTER_VALIDATE_URL)) 
					{ 
						$job->company->logo = $job->company->logo
						? url(Storage::url('company_logo/' . $job->company->logo))  
						: null;		
					} 
				 
					 
					$testQuestions = [];
					if ($job->user_id === $user->id) {
            $testQuestions = $job->testQuestions()->select('id', 'company_job_id', 'question')->get();
            foreach ($testQuestions as $question) {
                $question->options = $question->options()->select('id', 'question_id', 'option', 'is_correct')->get();
            }
					}

				 
				
					$data = [
            'status' => true,
            'message' => 'Job details fetched successfully.',
            'jobDetail' => $job,
						 'testQuestions' => $testQuestions
					];
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		
		//function for deleting job
		function deleteJobVacancy(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$job = CompanyJob::findOrFail($request->job_id); 
				
				if (!$job) {
					$data = ['status' => false,'message'=> 'Job is not found']; 
					return response()->json($data);
				}
 
				$jobApplications = CompanyJobApplication::select('id','resume',
						'self_introduction', )->where('company_job_id',$request->job_id)->get();
				
				foreach ($jobApplications as $application) {
            // Delete resume if exists
            if($application->resume) {
                $resumePath = "job_application_resume/" . $application->resume;
               if (Storage::disk('public')->exists($resumePath)) {  
                Storage::disk('public')->delete($resumePath);
							} 
            }

            // Delete introduction video if exists
            if($application->self_introduction) {
                $introPath = "job_application_introduction/" . $application->self_introduction;
               if (Storage::disk('public')->exists($introPath)) {  
                Storage::disk('public')->delete($introPath);
							} 
            }
				}
				
				// Delete the job record
				$job->delete();
				
				 //dispach event for real time updation
				 JobDeleteEvent::dispatch( 
				 	 ['job_id'=>$request->job_id, 'user_id'=>$user->id] 
				  );  
				 
				$data = ['status' => true,'message'=> 'Job is deleted successfully.']; 
				 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		
		}
	





	//function for save job
		function saveJobVacancy(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$has_saved = true;
			 
				$save = CompanyJobSave::where('user_id', $user->id)->where('company_job_id',$request->job_id)->first();
				if($save)
				{
					$save->delete();
					$has_saved =  false;
				}
				else
				{
					$createSave = CompanyJobSave::create(['user_id'=>$user->id, 'company_job_id'=>$request->job_id]);
					$has_saved = true;
				} 
				
				 
					 
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Save operation is successfull.', 'has_saved'=>$has_saved]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		
		}
		
		
		
		
		//function for checking user has attempt test or applied job if not then return test questions
		function checkApplicationStatus(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$jobId = $request->job_id;
				$data = null;
				 
				 
				  // Fetch the first matching attempt
        $attempt = CompanyJobTestAttempt::where('company_job_id', $jobId)
            ->where('user_id', $user->id)
						->select(['id','status', 'score'])
            ->first();

        if ($attempt ) {
					 
            // Check if the user has already applied
            $application = CompanyJobApplication::where('company_job_id', $jobId)
                ->where('user_id', $user->id)
                 ->exists();

            if ($application) {
                $data = [
                    'status' => true,
                    'already_applied' => true
                ];
            } else {
                $data = [
                    'status' => true,
										'already_applied' => false,
                    'attempts' => $attempt,
                ];
            }
        } else {
            // Fetch test questions if no valid attempt is found
            $testQuestions = CompanyJobTestQuestion::select('id', 'company_job_id', 'question')
                ->where('company_job_id', $jobId)
                ->get();

            // Add options to each test question
            foreach ($testQuestions as $question) {
                $question->options = $question->options()->select('id', 'question_id', 'option', 'is_correct')->get();
            }
						//fetch time limit for test
						$jobData = CompanyJob::select('id','time_limit') 
							->findOrFail($jobId); 
							
            $data = [
                'status' => true,
                'attempts' => null,
                'testQuestions' => $testQuestions,
                'timeLimit' => $jobData->time_limit,
            ];
        }


				// Return the response as a JSON response
				return response()->json($data);

			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		
		}
		

		//function for uploading or submitting job test attempt
		function UploadJobTestAttempt(Request $request)
		{
			// Validate the request data
        $validated = $request->validate([
						'job_id' => 'required|exists:company_jobs,id',
            'score' => 'required|integer|min:0|max:100',
            'answers' => 'required|array',
            'answers.*.question_id' => 'required|exists:company_job_test_questions,id',  
            'answers.*.selected_option_id' => 'required|exists:company_job_test_question_options,id',  
        ]);
				
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				 
				$jobId = $validated['job_id'];

        // Create a new test attempt
        $testAttempt = CompanyJobTestAttempt::create([
            'user_id' => $user->id,
            'company_job_id' => $jobId,
            'score' => $validated['score'],
            'status' => $validated['score'] >= 50, // Set status based on score
            'answers' => $validated['answers'],
        ]);
				$data =  [
						'status' => true,
            'message' => 'Test attempt submitted successfully.',
            'attempt' => $testAttempt->only(['id','status', 'score']),
					];
        
				// Return the response as a JSON response
				return response()->json($data);

			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		
		}
		

	
	//function for uploading or submitting job  application
		function UploadJobApplication(Request $request)
		{
			// Validate the request data
        $validated = $request->validate([
            'job_id' => 'required|exists:company_jobs,id',
            'resume' => 'required', // Validate PDF, max 5MB
            'self_introduction' => 'required|mimes:mp4|max:20480', // Validate MP4 video, max 20MB
        ]);

				
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate(); 
				
				$jobId = $validated['job_id'];
				
				 
				
				
				$question = CompanyJobTestQuestion::where('company_job_id', $jobId)
						->select(['id'])
            ->first();
				 
				$attempt = null;
				if($question != null)
				{
				 // Fetch the first matching attempt
					$attempt = CompanyJobTestAttempt::where('company_job_id', $jobId)
							->where('user_id', $user->id)
							->select(['id','status'])
							->first();
					if( !$attempt->status)
					{
						return response()->json([
							'status' => false,
							'message' => 'Failed in test,Enable to apply the job.',
							 
						]);
					}
				}
				//creating new job application
				$newJobApplication = new CompanyJobApplication();
				$newJobApplication->user_id = $user->id;  
        $newJobApplication->company_job_id = $jobId; 
				$newJobApplication->test_attempt_id = $attempt ? $attempt->id : null; 
        $newJobApplication->resume = '';
        $newJobApplication->self_introduction = '';
        $newJobApplication->status = "submitted";  
        $newJobApplication->save();
				
				 // Handle resume upload
        if($request->hasFile('resume')) {
            $resumeFileName = 'job_application_' . $newJobApplication->id . '_resume.' . $request->file('resume')->extension();
           // $request->file('resume')->move(public_path('job_application_resume/'), $resumeFileName); 
						$request->file('resume')->storeAs('job_application_resume', $resumeFileName, 'public');

            $newJobApplication->resume = $resumeFileName; 
        }
				// Handle self introduction vedio upload
        if($request->hasFile('self_introduction')) {
            $introFileName = 'job_application_' . $newJobApplication->id . '_self_introduction.' . $request->file('self_introduction')->extension();
            
						//$request->file('self_introduction')->move(public_path('job_application_introduction/'), $introFileName); 
						$request->file('self_introduction')->storeAs('job_application_introduction', $introFileName, 'public');
           
					 $newJobApplication->self_introduction = $introFileName; 
        }
         $newJobApplication->save();
				
				// Dynamically load additional relationships and aggregates
        $newJobApplication->load([
            'user:id,name,userID',
						'user.customer:id,user_id,image',
						'testAttempt' => function ($query) use ($user) {
								$query->where('user_id', $user->id)
									 ->select('id','company_job_id','status');
						}		
        ]);
        
			//getting full profile image url of owner
				$newJobApplication->user->customer->image = $newJobApplication->user->customer->image
				? url(Storage::url('profile_image/' . $newJobApplication->user->customer->image))  
				: null;	
				
				
        $newJobApplicationData = $newJobApplication->only([
           'id','user_id', 'company_job_id','test_attempt_id', 'status', 'created_at', 'created_at_human_readable'
        ]); 
        $newJobApplicationData['user'] = $newJobApplication->user;
        $newJobApplicationData['test_attempt'] = $newJobApplication->testAttempt;
        
				 
			 	$job = CompanyJob::select('id','user_id')->withCount('applications')->findOrFail($jobId); 
				
										
				//dispach event for real time updation
				AddNewJobApplicationEvent::dispatch($newJobApplicationData);
				JobApplicationCountEvent::dispatch([
				'job_id'=>$jobId, 
				'job_user_id'=>$job->user_id,
				'applications_count'=>$job->applications_count,
				
				] );
				 	 
			$data =  [
						'status' => true,
            'message' => 'Job application is submitted successfully.',
             
					];
        
				// Return the response as a JSON response
				return response()->json($data);

			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		
		}
		

	

		 //function for fetching job applications
		function getJobApplications(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$data = [];
				if($request->has_job != null && $request->has_job)
				{
					$job = CompanyJob::select(['id','title','expires_at', 'created_at'])->findOrFail($request->job_id);
					 // If job is not found, return an error response
					if (!$job) {
							return response()->json(['status' => false,'message'=> 'Job is not found.']);
					}
					  
					
					 // Fetch the application statistics and store them in variables
					$totalApplications = $job->applications()->count(); 

					// Add the statistics as custom attributes on the job object
					$job->totalApplications = $totalApplications; 
					$data['job'] = $job;
			}
				
				
				$jobApplications = CompanyJobApplication::select('id','user_id', 'company_job_id','test_attempt_id', 'status', 'created_at')
										->where('company_job_id',$request->job_id)
										->with([
											'user:id,name,userID',
											'user.customer:id,user_id,image',
											'testAttempt' => function ($query) use ($user) {
													$query->where('user_id', $user->id)
														 ->select('id','company_job_id','status');
											}		
										])
										->orderBy('id', 'desc')->cursorPaginate(10);
				
				foreach($jobApplications as $application) 
				{
						 
					if (!filter_var($application->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				
						//getting full profile image url of owner
						$application->user->customer->image = $application->user->customer->image
						? url(Storage::url('profile_image/' . $application->user->customer->image))  
						: null;
					}
					
				}
				 
					 
				$data['status'] = true;
				$data['jobApplications'] = $jobApplications;
				$data['message'] = 'List of job application is ready.';
					
				// Return the posts as a JSON response 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}

		
		
		//function for fetching job applications detail
		function getJobApplicationDetail(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				 
				  
				
				$jobApplication = CompanyJobApplication::select(
						'id',
						'user_id',
						'company_job_id',
						'test_attempt_id',
						'resume',
						'self_introduction',
						'status',
						'created_at'
				)
				->with([
						'user:id,name,userID,email',
						'user.customer:id,user_id,image,mobile_number,city_village,state,country',
					 
						'testAttempt' => function ($query) {
								$query->select('id', 'company_job_id', 'status','score', 'answers');
						}, 
					'job:id,expires_at,created_at',
					'job.testQuestions:id,company_job_id,question',
					'job.testQuestions.options:id,question_id,option,is_correct',
				]) 
				->findOrFail($request->id);
				 
				//getting full profile image url  
				$jobApplication->user->customer->image = $jobApplication->user->customer->image
				? url(Storage::url('profile_image/' . $jobApplication->user->customer->image))  
				: null;
				
				//getting full intro video url 
				$jobApplication->self_introduction = $jobApplication->self_introduction
				? url(Storage::url('job_application_introduction/' . $jobApplication->self_introduction))  
				: null;
					 
				//getting full intro video url 
				$jobApplication->resume = $jobApplication->resume
				? url(Storage::url('job_application_resume/' . $jobApplication->resume))  
				: null;
					 
					 
					 
				$data = ['status' => true, 'message' => 'List of job application is ready.',  'jobApplication' => $jobApplication, ];
					
				// Return the posts as a JSON response 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	 

		
		
		//function  for update job application status
		function updateJobApplicationStatus(Request $request)
		{
			
			// Validate the incoming data
        $validated = $request->validate([
            'status' => 'required|string|in:submitted,in_review,shortlisted,accepted,interview_scheduled,rejected',
        ]);

 
			try{
				
				$jobApplication = CompanyJobApplication::findOrFail($request->id);
				$jobApplication->status = $request->status;
				$jobApplication->save();
				
				if (!$jobApplication) {
							return response()->json(['status'=>false, 'message' => 'Job application not found'], 404);
				}
				
			 $data = ['status' => true, 'message' => 'Job application status is updated successfully.'  ];
					
				// Return the posts as a JSON response 
				return response()->json($data);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status'=>false, 'message'=>$e->getMessage()];
				return response->json($data);
			}
		}



		//function for download resume
		function downloadResume(Request $request)
		{ 
			try
			{
				// fetch assignment detail
				$jobApplication= CompanyJobApplication::select('id', 'resume')->findOrFail($request->id); 
				$filename =  $jobApplication->resume;
				
			/*	$filePath = public_path('job_application_resume/' . $filename);

        // Check if file exists
        if (!file_exists($filePath)) {
            return abort(404, 'File not found');
        }

        // Return file as download
        return response()->download($filePath);*/
				
					 
			 $filePath = 'job_application_resume/' . $filename;

				if (Storage::disk('public')->exists($filePath))
				{
            return Storage::disk('public')->download($filePath);
        } else {
            return response()->json(['error' => 'File not found'], 404);
        }
				
				
      }
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}  
		}

}
