<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;	
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Post; 
use App\Models\Workfolio; 
use App\Models\CompanyJob; 
use App\Models\Freelance; 
use App\Models\Problem; 
use App\Models\User; 
use App\Models\Community; 

use JWTAuth;
use Exception;
class ExploreController extends Controller
{
    //function for fetching explore user
		function getExploreUser(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
				
				// Get the search input from the request, if provided
        $searchInput = $request->input('searchInput');

				$userListQuery = User::select('id', 'userID', 'name')
				->whereNot('id', $user->id)
				->whereNot('user_role', 'Admin')
				->with(['customer:id,user_id,image'])
				->orderBy('id', 'desc');
				
				// If searchInput is provided, filter based on search input, else filter by user's interests
        if ($searchInput) {
						 
            // Filter by ID, UserId, or email
            $userListQuery->where(function ($query) use ($searchInput) {
                $query->where('id', 'like', "%$searchInput%")
                      ->orWhere('userID', 'like', "%$searchInput%")
                      ->orWhere('name', 'like', "%$searchInput%")
                      ->orWhere('email', 'like', "%$searchInput%");
            });
                 
             
        } else {
           $userListQuery->where(function ($query) use ($userInterests) {
						 $query->whereHas('customer', function ($query) use ($userInterests) {
									foreach ($userInterests as $interest) {
											$query->orWhereJsonContains('interest', $interest);   
									}
							 });
					});
        }
				
				$userList = $userListQuery->cursorPaginate(10); 
				
				// Convert image paths to full URLs
				foreach ($userList as $user) {
					if ( $user->customer) { // Check if user and customer exist
							if (!filter_var($user->customer->image, FILTER_VALIDATE_URL)) {
									$user->customer->image = $user->customer->image
											? url(Storage::url('profile_image/' . $user->customer->image))
											: null;
							}
					}
			}

				
				
         // Return the users as a JSON response
				$data = ['status' => true,'message'=> 'User List is ready.', 'userList'=>$userList]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		//function for fetching explore post
		function getExplorePost(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
				
				// Get the search input from the request, if provided
        $searchInput = $request->input('searchInput');

				$postListQuery = Post::select('id', 'attachment', 'created_at'   ) 
				->withCount('likes') 
				->withExists(['likes as has_liked' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
				}])
				->withExists(['saves as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
				}])
				->withCount('comments')
				->orderBy('id', 'desc')
				->whereNot('user_id',$user->id);
				
				// If searchInput is provided, filter based on search input, else filter by user's interests
        if ($searchInput) {
						 // Split searchInput into an array of words
            $searchWords = array_filter(explode(' ', $searchInput));

            $postListQuery->where(function ($query) use ($searchInput,$searchWords) {
                $query->whereHas('user', function ($query) use ($searchInput) {
                    $query->where('id', 'like', "%$searchInput%")
                          ->orWhere('userID', 'like', "%$searchInput%")
                          ->orWhere('name', 'like', "%$searchInput%")
                          ->orWhere('email', 'like', "%$searchInput%");
                });
								
                // Compare each word with the tags field
                foreach ($searchWords as $word) 
								{
                  $query->orWhereJsonContains('tags', $word);
                }
            });
        } else {
           $postListQuery->where(function ($query) use ($userInterests) {
						foreach ($userInterests as $interest) {
								$query->orWhereJsonContains('tags', $interest);   
						}
					});
        }
				
				$postList = $postListQuery->cursorPaginate(10); 
				
				// Convert image paths to full URLs
				foreach ($postList as $post) {
					
					$fileExtension = !empty($post->attachment) && isset($post->attachment[0])  && is_string($post->attachment[0]) 
										? pathinfo($post->attachment[0], PATHINFO_EXTENSION) 
										: null;
					
					if($fileExtension == null)
					{
						$post->attachment = null;
					}
					else 
					{
						$folderName = '';
						if($fileExtension == 'mp4')
						{
							$folderName = 'post_video_thumbnail';	
							$thumbnailFileName = pathinfo($post->attachment[0], PATHINFO_FILENAME) . '.png';
							$post->attachment = url(Storage::url($folderName . '/' . $thumbnailFileName));	
						}
						else
						{
							$folderName = 'post_image'; 
							 
							$post->attachment = $post->attachment[0]
							? url(Storage::url($folderName .'/' . $post->attachment[0]))  
							: null;
							 
						}
						
					}
									
				}
				
				
         // Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Post List is ready.', 'postList'=>$postList]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		 
		//function for fetching explore workfolio
		function getExploreWorkfolio(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
				
				// Get the search input from the request, if provided
        $searchInput = $request->input('searchInput');


				$worksQuery = Workfolio::select('id', 'title',   'created_at', 'user_id')  
        ->with([
						'user:id,userID', 
						 'user.customer:id,user_id,image', 
        ])
				->withAvg('workfolioReview', 'rating')->withCount('workfolioReview')
				->orderBy('id', 'desc')
				->whereNot('user_id', $user->id);
				
				// If searchInput is provided, filter based on search input, else filter by user's interests
        if ($searchInput) 
				{
					// Split searchInput into an array of words
					$searchWords = array_filter(explode(' ', $searchInput));

					$worksQuery->where(function ($query) use ($searchInput, $searchWords) 
					{ 
						$query->whereHas('user', function ($query) use ($searchInput) {
                    $query->where('id', 'like', "%$searchInput%")
                          ->orWhere('userID', 'like', "%$searchInput%")
                          ->orWhere('name', 'like', "%$searchInput%")
                          ->orWhere('email', 'like', "%$searchInput%");
                });
								
						foreach ($searchWords as $word) 
						{
								$query->orWhere('title', 'like', "%$word%")
											->orWhereJsonContains('tags', $word);
						}
					});
					
					
					 
						
        } else {
					// Compare user's interests with the skill_required for the job
					$worksQuery->where(function ($query) use ($userInterests) {
						foreach ($userInterests as $interest) {
							$query->orWhereJsonContains('tags', $interest);   
						}
					});
        }
				
				$works = $worksQuery->cursorPaginate(10); 
				
				 //getting full url of files 
				foreach ($works as $work) { 
					if (!filter_var($work->user->customer->image, FILTER_VALIDATE_URL)) 
						{
									$work->user->customer->image = $work->user->customer->image
									? url(Storage::url('profile_image/' . $work->user->customer->image))  
									: null;
						}	 
				}
					
					
         // Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Workfolio List is ready.', 'workList'=>$works]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		 
		
		
		
		
		//function for fetching explore problem
		function getExploreProblem(Request $request)
		{
				try {
						// Retrieve the authenticated user from the JWT token
						$user = JWTAuth::parseToken()->authenticate();
						$userInterests = $user->customer->interest; // Get user's interests (stored as JSON)

						// Get the search input from the request, if provided
						$searchInput = $request->input('searchInput');

						// Build the base query for problems
						$problemQuery = Problem::select('id', 'title', 'created_at', 'user_id')
								->with([
										'user:id,userID',
										'user.customer:id,user_id,image',
								])
								->withCount('solutions')
								->orderBy('id', 'desc')
								->whereNot('user_id', $user->id);

						// Apply search filters
						if ($searchInput) 
						{
								// Split searchInput into an array of words
								$searchWords = array_filter(explode(' ', $searchInput));
								
							
								$problemQuery->where(function ($query) use ($searchInput, $searchWords) {
									$query->whereHas('user', function ($query) use ($searchInput) {
                    $query->where('id', 'like', "%$searchInput%")
                          ->orWhere('userID', 'like', "%$searchInput%")
                          ->orWhere('name', 'like', "%$searchInput%")
                          ->orWhere('email', 'like', "%$searchInput%");
									});
								
								
										foreach ($searchWords as $word) {
												$query->orWhere('title', 'like', "%$word%"); // Use 'like' for each word
										}
								});
						} else {
								// Filter by user's interests
								$problemQuery->where(function ($query) use ($userInterests) {
										foreach ($userInterests as $interest) {
												$query->orWhere('title', 'like', "%$interest%"); // Use 'like' for interests
										}
								});
						}

						// Execute the query with cursor pagination
						$problems = $problemQuery->cursorPaginate(10);
						
						 //getting full url of files 
							foreach ($problems as $problem) { 
								if (!filter_var($problem->user->customer->image, FILTER_VALIDATE_URL)) 
									{
												$problem->user->customer->image = $problem->user->customer->image
												? url(Storage::url('profile_image/' . $problem->user->customer->image))  
												: null;
									}	 
							}
				
						// Return the posts as a JSON response
						$data = ['status' => true,'message'=> 'Problem List is ready.', 'problemList'=>$problems]; 
						return response()->json($data);
				} catch (Exception $e) {
						// Catch any exception and return an error message
						$data = ['status' => false, 'message' => $e->getMessage()];
						return response()->json($data);
				}
		}

		
		
		 
		
		
		
		
		//function for fetching explore jobs
		function getExploreJob(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
			
				// Get the search input from the request, if provided
        $searchInput = $request->input('searchInput');

				
				$minSalary = $request->input('min_salary', 0);
				$maxSalary = $request->input('max_salary', PHP_INT_MAX);
				if ($maxSalary === 0 || $maxSalary === null || $maxSalary === '') {
						$maxSalary = PHP_INT_MAX;
				}
				$jobLocation = $request->input('job_location', '');
        $employmentType = $request->input('employment_type','');
        $workFromHome = $request->input('work_from_home', null);
				
			 $jobListQuery = CompanyJob::select('id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  )  
			  
				//filter min salary and max salary
				 ->whereBetween('salary', [$minSalary, $maxSalary]) 
				 
				
				//filter job location
				 
				 ->when(!empty($jobLocation), function ($query) use ($jobLocation) {
							$query->where('job_location', $jobLocation); // Apply location filter
					})
					//filter employment_type
					->when(!empty($employmentType), function ($query) use ($employmentType) {
							$query->where('employment_type', $employmentType); // Apply employment type filter
					})
					
					//filter employment_type
					->when(!is_null($workFromHome), function ($query) use ($workFromHome) {
							$query->where('work_from_home', $workFromHome); // Apply work-from-home filter
					})
				
				
				//filter job not expired
				->whereNot('user_id', $user->id)
				->whereNotNull('expires_at')
				->where('expires_at','>', now()) 
				
				->with([  
							'company:id,name,logo',
							'attempts' => function ($query) use ($user) {
									$query->where('user_id', $user->id)
										->select('id','company_job_id','status'); 
							}	,	
													
						]) 
				->withExists(['savedJobs as has_saved' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
							}]) 
				->withExists(['applications as already_applied' => function ($query) use ($user) {
								$query->where('user_id', $user->id);
							}]) 
				->orderBy('id', 'desc');
				
				
				// If searchInput is provided, filter based on search input, else filter by user's interests
        if ($searchInput) {
						 // Split searchInput into an array of words
            $searchWords = array_filter(explode(' ', $searchInput));

            $jobListQuery->where(function ($query) use ($searchInput,  $searchWords) {
                
								$query->whereHas('user', function ($query) use ($searchInput) {
                    $query->where('id', 'like', "%$searchInput%")
                          ->orWhere('userID', 'like', "%$searchInput%")
                          ->orWhere('name', 'like', "%$searchInput%")
                          ->orWhere('email', 'like', "%$searchInput%");
								});
                 
                foreach ($searchWords as $word) {
                    $query->orWhere('title', 'like', "%$word%")
										->orWhereJsonContains('skill_required', $word);
                }
            });
        } else {
            // Compare user's interests with the skill_required for the job
            $jobListQuery->where(function ($query) use ($userInterests) 
						{
							foreach ($userInterests as $interest) 
							{
								$query->orWhereJsonContains('skill_required', $interest);  
							}
            });
        }
				
				
				$jobList = $jobListQuery->cursorPaginate(10);
				
				//getting full url of files 
				foreach ($jobList as $job) { 
					if (!filter_var($job->company->logo, FILTER_VALIDATE_URL)) 
						{
									$job->company->logo = $job->company->logo
									? url(Storage::url('company_logo/' . $job->company->logo))  
									: null;
						}	 
				}
				
				$locations = null;
				if ($request->has('isJobLocationsEmpty') && $request->input('isJobLocationsEmpty')) 
				{
					// Fetch unique job locations from the database
					$locations = CompanyJob::select('job_location')
														 ->distinct()
														 ->pluck('job_location'); // Using pluck to only return the 'job_location' field

				}
					
				
         // Return the posts as a JSON response
				$data = ['status' => true,'message'=>  'Job List of user is ready.', 'jobList'=>$jobList]; 
				if($locations != null)
				{
					$data['jobLocations']=$locations;
				}
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	





 
	//function for fetching freelance
	function getExploreFreelance(Request $request)
	{
    try {
        // Retrieve the authenticated user from the JWT token
        $user = JWTAuth::parseToken()->authenticate();
        $userInterests = $user->customer->interest; // Get user's interests (stored as JSON)

        // Get the search input from the request, if provided
        $searchInput = $request->input('searchInput');

        // Build the query
        $freelanceListQuery = Freelance::select('id', 'user_id', 'title', 'skill_required', 'deadline', 'budget_min', 'budget_max', 'payment_type', 'created_at')
            ->whereNot('user_id', $user->id)
            ->whereNotNull('deadline')
            ->where('deadline', '>', now())
            ->with([
                'user:id,userID',
                'user.customer:id,user_id,image',
            ])
            ->withExists(['savedFreelance as has_saved' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->withExists(['bids as already_bid' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->orderBy('id', 'desc');

        // If searchInput is provided, filter based on search input, else filter by user's interests
        if ($searchInput) {
						 // Split searchInput into an array of words
            $searchWords = array_filter(explode(' ', $searchInput));

            $freelanceListQuery->where(function ($query) use ($searchInput, $searchWords) {
                
								$query->whereHas('user', function ($query) use ($searchInput) {
                    $query->where('id', 'like', "%$searchInput%")
                          ->orWhere('userID', 'like', "%$searchInput%")
                          ->orWhere('name', 'like', "%$searchInput%")
                          ->orWhere('email', 'like', "%$searchInput%");
								});
								 
                foreach ($searchWords as $word) {
                    $query->orWhere('title', 'like', "%$word%")
										->orWhereJsonContains('skill_required', $word);
                }
            });
        } else {
            // Compare user's interests with the skill_required for the job
            $freelanceListQuery->where(function ($query) use ($userInterests) {
                foreach ($userInterests as $interest) {
                    $query->orWhereJsonContains('skill_required', $interest);  
                }
            });
        }

        // Get the result using cursor pagination
        $freelanceList = $freelanceListQuery->cursorPaginate(10);

				//getting full url of files 
				foreach ($freelanceList as $freelance) { 
					if (!filter_var($freelance->user->customer->image, FILTER_VALIDATE_URL)) 
						{
									$freelance->user->customer->image = $freelance->user->customer->image
									? url(Storage::url('profile_image/' . $freelance->user->customer->image))  
									: null;
						}	 
				}
		
		
        // Loop through the freelance list and calculate review stats
        foreach ($freelanceList as $freelance) {
            $selectedUser = $freelance->user;
            // Calculate hirer review stats
            $hirerReview = [
                'avg_rating' => $selectedUser->hirerReviewsReceived()->avg('rating') ?? 0,
                'review_count' => $selectedUser->hirerReviewsReceived()->count(),
            ];
            // Add the stats to the user object within the freelance
            $freelance->user->hirer_review_stats = $hirerReview;
        }

        // Return the posts as a JSON response
        $data = ['status' => true, 'message' => 'Freelance work is ready.', 'freelanceList' => $freelanceList];
        return response()->json($data);
    } catch (Exception $e) {
        $data = ['status' => false, 'message' => $e->getMessage()];
        return response()->json($data);
    }
}

		
		
		
	//function for fetching communities
		function getExploreCommunities(Request $request)
		{
				try {
						// Retrieve the authenticated user from the JWT token
						$user = JWTAuth::parseToken()->authenticate();
						$userInterests = $user->customer->interest; // Get user's interests (stored as JSON)

						// Get the search input from the request, if provided
						$searchInput = $request->input('searchInput');

						// Build the base query for community
						$communityQuery = Community::select('id', 'name',  'created_by', 'privacy', 'image' ) 
							->whereNot('created_by',  $user->id)
								->with([
									'requests'=> function ($query) use ($user) {
												$query->where('user_id', $user->id)
														 ->select('id','community_id','status'); 
										}		
								])
								->withCount('members')
								->withExists(['members as has_joined' => function ($query) use ($user) {
									$query->where('user_id', $user->id)->whereNot('role', 'admin');
								}]) 
								->orderBy('id', 'desc');

						// Apply search filters
						if ($searchInput) {
								// Split searchInput into an array of words
								$searchWords = array_filter(explode(' ', $searchInput));

								$communityQuery->where(function ($query) use ($searchInput, $searchWords) {
									
									$query->whereHas('creator', function ($query) use ($searchInput) {
                    $query->where('id', 'like', "%$searchInput%")
                          ->orWhere('userID', 'like', "%$searchInput%")
                          ->orWhere('name', 'like', "%$searchInput%")
                          ->orWhere('email', 'like', "%$searchInput%");
									});
								
									foreach ($searchWords as $word) {
											$query->orWhere('name', 'like', "%$word%"); // Use 'like' for each word
									}
								});
						} else {
								// Filter by user's interests
								$communityQuery->where(function ($query) use ($userInterests) {
										foreach ($userInterests as $interest) {
												$query->orWhere('name', 'like', "%$interest%"); // Use 'like' for interests
										}
								});
						}

						// Execute the query with cursor pagination
						$communities = $communityQuery->cursorPaginate(10);
						
						 //getting full url of files 
							foreach ($communities as $community) { 
								if (!filter_var($community->image, FILTER_VALIDATE_URL)) 
									{
											 $community->image = $community->image
										? url(Storage::url('community_profile_image/' . $community->image))  
										: null;
									}	 
							}
				
						// Return the posts as a JSON response
						$data = ['status' => true,'message'=> 'Community List is ready.', 'communityList'=>$communities]; 
						return response()->json($data);
				} catch (Exception $e) {
						// Catch any exception and return an error message
						$data = ['status' => false, 'message' => $e->getMessage()];
						return response()->json($data);
				}
			
		}
		
}

