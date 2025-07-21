<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Post;
use App\Models\Workfolio;
use App\Models\Problem;
use App\Models\CompanyJob;
use App\Models\Freelance;

use JWTAuth;
use Exception;
use Carbon\Carbon;

class HomeController extends Controller
{
    /**
     * Get feed for home page (mixed content: posts, problems, jobs, freelance, workfolio).
     */
    public function getFeed(Request $request)
    {
        try {
            // Retrieve the authenticated user from the JWT token
            $user = JWTAuth::parseToken()->authenticate();

            // Retrieve the IDs of the users whom the authenticated user is following
            $followingIds = $user->following()->pluck('following_id'); 

            // Get user's interests (stored as JSON)
            $userInterests = $user->customer->interest;  

            // Get last created at cursor from request
            $lastTimestamp = $request->input('cursor');
            $last = $lastTimestamp ? Carbon::parse($lastTimestamp) : null;
						
						//limit of total count fetch per request
						$limit = 5;
            // Fetch posts
            $postList = $this->fetchPosts($user, $userInterests, $followingIds, $last, $limit);
						// Fetch workfolios
            $workfolioList = $this->fetchWorkfolios($user, $userInterests, $followingIds, $last, $limit); 
						// Fetch problems
            $problemList = $this->fetchProblems($user, $userInterests, $followingIds, $last, $limit);
						// Fetch jobs
            $jobList = $this->fetchJobs($user, $userInterests, $followingIds, $last, $limit);
						// Fetch Freelances
            $freelanceList = $this->fetchFreelances($user, $userInterests, $followingIds, $last, $limit);


						$merged = collect()
						->merge($postList)
						->merge($workfolioList) 
						->merge($problemList) 
						->merge($jobList) 
						->merge($freelanceList) 
						->sortByDesc('created_at')
						->values();
				
						$limitedFeed = $merged->take($limit);
						//$hasMore = $merged->count() > $limit;
						//changed hasMore (temporarily)
						$hasMore = $merged->count() >= $limit;
				
            // Return the posts as a JSON response
            return response()->json([
                'status' => true,
                'message' => 'Feed is ready.',
                'feedData' => $merged,
								'next_cursor' => $merged->last()?->created_at,
								'hasMore' => $hasMore,
								 
            ]);
        } catch (Exception $e) {
            return response()->json([
                'status' => false,
                'message' => $e->getMessage()
            ]);
        }
    }

    
		
		
		/**
     * Fetch posts based on user's interests and following
     */
    private function fetchPosts($user, $userInterests, $followingIds, $last, $limit=5)
    {
        $postList = Post::select('id', 'attachment', 'created_at', 'user_id')
            ->with([
                'user:id,userID,name',
                'user.customer:id,user_id,image',
            ])
            ->withCount('likes')
            ->withExists(['likes as has_liked' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->withExists(['saves as has_saved' => function ($query) use ($user) {
                $query->where('user_id', $user->id);
            }])
            ->withCount('comments') 
						->where('user_id', '!=', $user->id)						
            ->where(function ($query) use ($userInterests, $followingIds) {
                if (!empty($userInterests)) {
                    foreach ($userInterests as $interest) {
                        $query->orWhereJsonContains('category', $interest);
                    }
                }

                if (!$followingIds->isEmpty()) {
                    $query->orWhereIn('user_id', $followingIds);
                }
            })
            ->when($last, fn($q) => $q->where('created_at', '<', $last)) // For pagination
            ->latest()
            ->take($limit)
            ->get()
            ->each(fn($item) => $item->type = 'post');
						
							// Convert file paths to full URLs
        foreach ($postList as $post) 
				{
					
					//user profile
					if ($post->user->customer != null && !filter_var($post->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 
						$post->user->customer->image = $post->user->customer->image
						? url(Storage::url('profile_image/' . $post->user->customer->image))  
						: null; 
					}	

					//for post attachment
					$fileExtension = !empty($post->attachment) && isset($post->attachment[0])  && is_string($post->attachment[0]) 
						? pathinfo($post->attachment[0], PATHINFO_EXTENSION) 
						: null;
					
					if($fileExtension == null)
					{
						$post->attachment = null;
						continue;
					} 
					
					if($fileExtension == 'mp4')
					{ 
						$thumbnailFileName = pathinfo($post->attachment[0], PATHINFO_FILENAME) . '.png';
						$post->attachment = url(Storage::url('post_video_thumbnail/' . $thumbnailFileName));
						continue;										
					}
					if (!filter_var($post->attachment[0], FILTER_VALIDATE_URL)) 
					{ 
						$post->attachment = $post->attachment[0]
						? url(Storage::url('post_image/' . $post->attachment[0]))  
						: null; 
					}		 
				}
				
				
				return $postList;
    }


		/**
     * Fetch workfolio based on user's interests and following
     */
    private function fetchWorkfolios($user, $userInterests, $followingIds, $last, $limit=5)
    {
			
			$followingWork = Workfolio::select('id', 'title',   'created_at', 'user_id') 
        ->with([
						'user:id,userID', 
						'user.customer:id,user_id,image', 
        ])
				->withAvg('workfolioReview', 'rating')->withCount('workfolioReview')
				->withExists(['savedWorkfolio as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}]) 
				->where('user_id', '!=', $user->id)
				->where(function ($query) use ($userInterests, $followingIds) 
				{
					if (!empty($userInterests)) {
						foreach ($userInterests as $interest) {
							$query->orWhereJsonContains('category', $interest);
						}
					}

					if (!$followingIds->isEmpty()) {
						$query->orWhereIn('user_id', $followingIds);
					}
				}) 
				->when($last, fn($q) => $q->where('created_at', '<', $last))
        ->latest()
        ->take($limit)
        ->get()
        ->each(fn($item) => $item->type = 'workfolio');
				
				foreach ($followingWork as $workfolio) 
				{
						 
					if (!filter_var($workfolio->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				
						//getting full profile image url of owner
						$workfolio->user->customer->image = $workfolio->user->customer->image
						? url(Storage::url('profile_image/' . $workfolio->user->customer->image))  
						: null;
					}
					
				}
				
				return $followingWork;
				
		}
		
	

		/**
     * Fetch problem based on user's interests and following
     */
    private function fetchProblems($user, $userInterests, $followingIds, $last, $limit=5)
    {
				$followingProblem = Problem::select('id', 'title',   'created_at', 'user_id')  
					->with([
							'user:id,userID',
							'user.customer:id,user_id,image', 							
					])
					->withCount('solutions') 
					->withExists(['savedProblem as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}]) 
					->where('user_id', '!=', $user->id)
					->where(function ($query) use ($userInterests, $followingIds) {
						if (!empty($userInterests)) {
							foreach ($userInterests as $interest) {
								$query->orWhere('title', 'like', "%$interest%");
							}
						}

						if (!$followingIds->isEmpty()) {
							$query->orWhereIn('user_id', $followingIds);
						}
					}) 
					->when($last, fn($q) => $q->where('created_at', '<', $last))
					->latest()
					->take($limit)
					->get()
					->each(fn($item) => $item->type = 'problem');
					
					foreach ($followingProblem as $problem) 
					{ 
						if (!filter_var($problem->user->customer->image, FILTER_VALIDATE_URL)) 
						{ 				
							//getting full profile image url of owner
							$problem->user->customer->image = $problem->user->customer->image
							? url(Storage::url('profile_image/' . $problem->user->customer->image))  
							: null;
						}
						
					}
					return $followingProblem;
		}
		
		
		/**
     * Fetch jobs based on user's interests and following
     */
    private function fetchJobs($user, $userInterests, $followingIds, $last, $limit=5)
    {
			$jobs = CompanyJob::select('id','user_id', 'company_id', 'title',  'salary', 'payment_type', 'job_location', 'employment_type', 'skill_required',  'work_from_home','expires_at', 'created_at'  )  
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
					->whereNotNull('expires_at')
					->where('expires_at','>', now()) 
					->where('user_id', '!=', $user->id)
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
					->when($last, fn($q) => $q->where('created_at', '<', $last))
					->latest()
					->take($limit)
					->get()
					->each(fn($item) => $item->type = 'job');
				
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
					
					return $jobs;
		}
		
		
		/**
     * Fetch freelance based on user's interests and following
     */
    private function fetchFreelances($user, $userInterests, $followingIds, $last, $limit=5)
    {
			
			$freelanceList = Freelance::select('id','user_id', 'title',   'skill_required', 'deadline',  'budget_min',  'budget_max','payment_type', 'created_at'  )
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
						
						->whereNotNull('deadline')
						->where('deadline','>', now()) 
						 
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
						->when($last, fn($q) => $q->where('created_at', '<', $last))
						->latest()
						->take($limit)
						->get()
						->each(fn($item) => $item->type = 'freelance');
						
						
						// Loop through the freelance list and calculate review stats
						foreach ($freelanceList as $freelance) {
							
							if (!filter_var($freelance->user->customer->image, FILTER_VALIDATE_URL)) 
								{ 				
									//getting full profile image url of owner
									$freelance->user->customer->image = $freelance->user->customer->image
									? url(Storage::url('profile_image/' . $freelance->user->customer->image))  
									: null;
								}
								
								
								
								$selectedUser = $freelance->user;
								// Calculate hirer review stats
								$hirerReview = [
										'avg_rating' => $selectedUser->hirerReviewsReceived()->avg('rating') ?? 0,
										'review_count' => $selectedUser->hirerReviewsReceived()->count(),
								];
								// Add the stats to the user object within the freelance
								$freelance->user->hirer_review_stats = $hirerReview;
						}
						
						return $freelanceList;
						
		}
		
		
		
		 
		
		
}
