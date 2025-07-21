<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Freelance;  
use App\Models\FreelanceSave;  
use App\Models\User;  
use App\Models\FreelancerReview;  
 
use App\Events\AddNewFreelanceEvent;  
use App\Events\FreelanceDeleteEvent;  
 

use JWTAuth;
use Exception;
class FreelanceController extends Controller
{ 

		//function to add new freelance work
		function addNewFreelanceWork(Request $request)
		{
			// Validate the incoming data
			$request->validate([
					'title' => 'required|string',
					'description' => 'required|string',
					'skill_required' => 'nullable|array',
					'skill_required.*' => 'nullable|string',
					'budget_min' => 'required|numeric|min:0',
					'budget_max' => 'required|numeric|min:0|gte:budget_min', // Ensure budget_max is greater than or equal to budget_min
					
					'payment_type' => 'required|string|in:hourly,fixed,retainer,milestone_based,commission_based,equity_based,revenue_share,time_and_materials', // Validate payment type is either hourly or fixed
			
					'deadline' => 'required|date|after:today',
					'experience_level' => 'required|string|in:beginner,intermediate,expert',
					'duration' => 'required|string', // Assuming this is a simple string (e.g., "3 months", "1 year")
			]);
			try
			{
				// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$newfreelanceWork = Freelance::create([
            'user_id' => $user->id,
            'title' => $request->title,
            'description' => $request->description,
            'experience_level' => $request->experience_level,
            'skill_required' => $request->input('skill_required', []),  
            'deadline' => $request->deadline,
            'duration' => $request->duration,
            'budget_min' => $request->budget_min,
            'budget_max' => $request->budget_max,
            'payment_type' => $request->payment_type,
             
        ]);
		 
				 
				 


					
				 // Dynamically load additional relationships and aggregates
        $newfreelanceWork->load([
            'user:id,userID',
            'user.customer:id,user_id,image',
        ]);
         
				
				//getting full profile image url of owner
				$newfreelanceWork->user->customer->image = $newfreelanceWork->user->customer->image
				? url(Storage::url('profile_image/' . $newfreelanceWork->user->customer->image))  
				: null;			
				
				
				// Validate user existence
        $selectedUser = User::findOrFail($user->id);

        // Calculate hirer review stats
        $hirerReview = [
            'avg_rating' => $selectedUser->hirerReviewsReceived()->avg('rating') ?? 0,
            'review_count' => $selectedUser->hirerReviewsReceived()->count(),
        ];
				// Add the stats to the user object within the freelance
				$newfreelanceWork->user->hirer_review_stats = $hirerReview;




        // Prepare the updated freelance work data for response
        $newfreelanceWorkData = $newfreelanceWork->only([
            'id', 'user_id', 'title', 'skill_required', 'deadline', 'budget_min', 'budget_max', 'payment_type', 'created_at', 'created_at_human_readable', 'status',
        ]);
        $newfreelanceWorkData['user'] = $newfreelanceWork->user;
        $newfreelanceWorkData['bids_count'] = $newfreelanceWork->bids_count;
				
  
				//dispach event for real time updation
					AddNewFreelanceEvent::dispatch($newfreelanceWorkData);
				  

				// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Freelance work added successfully.','newfreelanceWork'=>$newfreelanceWorkData ]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		//function for fetching logged user or perticular frelance work 
		function getUserFreelanceWork(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
		  
					$user_id = $request->userId ?? $user->id;
					
					 
					$freelanceQuery = Freelance::select('id','user_id', 'title',   'skill_required', 'deadline',  'budget_min',  'budget_max','payment_type', 'created_at'  )
						->where('user_id', $user_id);
						
						  // If `userID` is provided in the request, apply a filter for status = 'open' and aslo deadline
							if ($request->userId) {
								
									$freelanceQuery->whereNotNull('deadline')
									->where('deadline','>', now()) 
									->withExists(['savedFreelance as has_saved' => function ($query) use ($user) {
											$query->where('user_id', $user->id);
										}])
									->withExists(['bids as already_bid' => function ($query) use ($user) {
											$query->where('user_id', $user->id);
										}]);
										
							}
							else
							{
								$freelanceQuery->withCount('bids');
							}
						 
					$freelanceList = $freelanceQuery->with([  
							'user:id,userID,name',
							'user.customer:id,user_id,image', 
					  
					])  
					->orderBy('id', 'desc')->cursorPaginate(10);

					   
			 
				
					
					
					 // Validate user existence
        $selectedUser = User::findOrFail($user_id);

        // Calculate hirer review stats
        $hirerReview = [
            'avg_rating' => $selectedUser->hirerReviewsReceived()->avg('rating') ?? 0,
            'review_count' => $selectedUser->hirerReviewsReceived()->count(),
        ];
				
				// Loop through the freelance list and calculate review stats
				foreach ($freelanceList as $freelance) {
						 
						// Add the stats to the user object within the freelance
						$freelance->user->hirer_review_stats = $hirerReview;
						if (!filter_var($freelance->user->customer->image, FILTER_VALIDATE_URL)) 
						{ 				
							//getting full profile image url of owner
							$freelance->user->customer->image = $freelance->user->customer->image
							? url(Storage::url('profile_image/' . $freelance->user->customer->image))  
							: null;
						}
				}

				
					
				// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Freelance work is ready.','freelanceList'=>$freelanceList,   ]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		
		
		//function for fetching logged user saved frelance work 
		function getSavedFreelanceWork(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
		  
					 
					
					 
					$freelanceList = Freelance::select('id','user_id', 'title',   'skill_required', 'deadline',  'budget_min',  'budget_max','payment_type', 'created_at'  )
						 ->whereHas('savedFreelance', function ($query) use ($user) {
                        $query->where('user_id', $user->id); // Filter by saved Freelance 
            })
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
						->orderBy('id', 'desc')->cursorPaginate(10);

				 
				
					
					
					 
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

				
					
				// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Freelance work is ready.','freelanceList'=>$freelanceList, ]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		
		
		
		 //function for  fetching following user freelance
		function getInterestedFreelanceWork(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				// Retrieve the IDs of the users whom the authenticated user is following
				$followingIds = $user->following()->pluck('following_id');
				
				$userInterests =  $user->customer->interest ; 
				
					$freelanceList = Freelance::select('id','user_id', 'title',   'skill_required', 'deadline',  'budget_min',  'budget_max','payment_type', 'created_at'  )
					 
						->whereNotNull('deadline')
						->where('deadline','>', now()) 
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
					  
						]) 
						->withExists(['savedFreelance as has_saved' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
						}])
						->withExists(['bids as already_bid' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
						}])
						->orderBy('id', 'desc')->cursorPaginate(10);
 
				
					
					 
        
				
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

				
					
				// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Followed user freelance work is ready.','freelanceList'=>$freelanceList, ]; 
					return response()->json($data);	 
			  
					 
			 
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		 //function for  fetching   applied freelance
		function getAppliedFreelanceWork(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				 	
				
					$freelanceList = Freelance::select('id','user_id', 'title',   'skill_required', 'deadline',  'budget_min',  'budget_max','payment_type', 'created_at' )
						->whereHas('bids', function ($query) use ($user) {
                // Filter freelance that the user has applied for
                $query->where('user_id', $user->id);
            })
						->with([  
							'user:id,userID',
							'user.customer:id,user_id,image', 
							'bids'=> function ($query) use ($user) {
									$query->where('user_id', $user->id); 
							}		
						]) 
						->withExists(['savedFreelance as has_saved' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
						}])
						->withExists(['bids as already_bid' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
						}])
						->orderBy('id', 'desc')->cursorPaginate(10);

					   
				
					
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

						
					 
				
					 

				
					
				// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Followed user freelance work is ready.','freelanceList'=>$freelanceList, ]; 
					return response()->json($data);	 
			  
					 
			 
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		
		//function for delete freelance work
		function deleteFreelanceWork(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$freelance = Freelance::findOrFail($request->freelance_id); 
				
				if (!$freelance) {
					$data = ['status' => false,'message'=> 'Freelance work is not found']; 
					return response()->json($data);
				}
 
				// Delete the freelance work
				$freelance->delete();
				
				 //dispach event for real time updation
				 FreelanceDeleteEvent::dispatch( 
				 	 ['freelance_id'=>$request->freelance_id, 'user_id'=>$user->id] 
				  );  
				 
				$data = ['status' => true,'message'=> 'Freelance work is deleted successfully.']; 
				 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		
		}




		//function for save freelance work
		function saveFreelanceWork(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$has_saved = true;
			 
				$save = FreelanceSave::where('user_id', $user->id)->where('freelance_id',$request->freelance_id)->first();
				if($save)
				{
					$save->delete();
					$has_saved =  false;
				}
				else
				{
					$createSave = FreelanceSave::create(['user_id'=>$user->id, 'freelance_id'=>$request->freelance_id]);
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


		//function for get freelance work for update
		function getFreelanceWork(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
			//	$user = JWTAuth::parseToken()->authenticate();
				
				$freelance = Freelance::findOrFail($request->freelance_id);
			 
				 
				$freelanceData = $freelance->only([
				 'id',
				'title',
				'description',
				'skill_required',
				'budget_min',
				'budget_max',
				'payment_type',
				'deadline', 
				'experience_level',
				'duration', 
				]);
					
				
					
					
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Freelance work is ready for upadation.', 'freelanceData'=>$freelanceData]; 
					return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		
		}
 




		//function for update freelance work
		function updateFreelanceWork(Request $request)
		{
			
			   // Validate the incoming data
			$request->validate([
					'title' => 'required|string',
					'description' => 'required|string',
					'skill_required' => 'nullable|array',
					'skill_required.*' => 'nullable|string',
					'budget_min' => 'required|numeric|min:0',
					'budget_max' => 'required|numeric|min:0|gte:budget_min', // Ensure budget_max is greater than or equal to budget_min
					'payment_type' => 'required|string|in:hourly,fixed,retainer,per_project,milestone_based,commission_based,equity_based,bonus_based', // Validate payment type is either hourly or fixed
					
					'deadline' => 'required|date|after:today',
					'experience_level' => 'required|string|in:beginner,intermediate,expert',
					'duration' => 'required|string', // Assuming this is a simple string (e.g., "3 months", "1 year")
			]);
			
			
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
			  // Find the freelance work by ID
        $freelanceWork = Freelance::findOrFail($request->id);
				// Update the freelance work fields
        $freelanceWork->update([
            'title' => $request->title,
            'description' => $request->description,
            'experience_level' => $request->experience_level,
            'skill_required' => $request->input('skill_required', []),
            'deadline' => $request->deadline,
            'duration' => $request->duration,
            'budget_min' => $request->budget_min,
            'budget_max' => $request->budget_max,
            'payment_type' => $request->payment_type,
             
        ]);
				
				 
				
				
				
				
				 // Dynamically load additional relationships and aggregates
        $freelanceWork->load([
            'user:id,userID',
            'user.customer:id,user_id,image',
        ]);
				$freelanceWork->loadCount('bids');
				
				if (!filter_var($freelanceWork->user->customer->image, FILTER_VALIDATE_URL)) 
				{ 				
					//getting full profile image url of owner
					$freelanceWork->user->customer->image = $freelanceWork->user->customer->image
					? url(Storage::url('profile_image/' . $freelanceWork->user->customer->image))  
					: null;
				}
				
				
				
				// Validate user existence
        $selectedUser = User::findOrFail($user->id);

        // Calculate hirer review stats
        $hirerReview = [
            'avg_rating' => $selectedUser->hirerReviewsReceived()->avg('rating') ?? 0,
            'review_count' => $selectedUser->hirerReviewsReceived()->count(),
        ];
				// Add the stats to the user object within the freelance
				$freelanceWork->user->hirer_review_stats = $hirerReview;
			
        // Prepare the updated freelance work data for response
        $updatedFreelanceWorkData = $freelanceWork->only([
            'id', 'user_id', 'title', 'skill_required', 'deadline', 'budget_min', 'budget_max', 'payment_type', 'created_at', 'created_at_human_readable', 'status',
        ]);
        $updatedFreelanceWorkData['user'] = $freelanceWork->user;
        $updatedFreelanceWorkData['bids_count'] = $freelanceWork->bids_count;
				
				 
				
				
				// Return the response as a JSON response
				$data = ['status' => true,
					'message'=> 'Freelance work is updated successfully.', 
					'updatedFreelanceWork' => $updatedFreelanceWorkData,				
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



		//function for get freelance work detail
		function getFreelanceWorkDetail(Request $request)
		{
			
			try{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				
				$freelance = Freelance::with([  
							'user:id,userID',
							'user.customer:id,user_id,image', 
							'bids'=> function ($query) use ($user) {
									$query->where('user_id', $user->id); 
							}
					  
					])
					->withCount('bids')
					->withExists(['savedFreelance as has_saved' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
						}])
						->withExists(['bids as already_bid' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
						}])
						->findOrFail($request->freelance_id);
				
				
				if (!filter_var($freelance->user->customer->image, FILTER_VALIDATE_URL)) 
				{ 				
					//getting full profile image url of owner
					$freelance->user->customer->image = $freelance->user->customer->image
					? url(Storage::url('profile_image/' . $freelance->user->customer->image))  
					: null;
				}
				
				
				// Validate user existence
        $selectedUser = User::findOrFail($freelance->user_id);

        // Calculate hirer review stats
        $hirerReview = [
            'avg_rating' => $selectedUser->hirerReviewsReceived()->avg('rating') ?? 0,
            'review_count' => $selectedUser->hirerReviewsReceived()->count(),
        ];
				// Add the stats to the user object within the freelance
				$freelance->user->hirer_review_stats = $hirerReview;



			 // Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Freelance work is ready.', 'freelanceDetail'=>$freelance]; 
					return response()->json($data);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		} 

		
		//function for upload reviews on hirer 
		function uploadHirerReview(Request $request)
		{
			// Validate the incoming request
        $request->validate([  
            'hirer_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
				
				
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				// Create the review
        FreelancerReview::create([
            'user_id' => $user->id,
            'hirer_id' => $request->hirer_id,
            'review' => $request->comment,
            'rating' => $request->rating,
        ]);
				
				$selectedHirer= User::findOrFail($request->hirer_id);

        // Calculate hirer review stats
         
				$hirer_review_stats = [
            'avg_rating' => $selectedHirer->hirerReviewsReceived()->avg('rating') ?? 0,
            'review_count' => $selectedHirer->hirerReviewsReceived()->count(),
             
            'hirer_id' => $request->hirer_id,
        ];
				
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Hirer review is add successfullly.', 'hirer_review_stats'=>$hirer_review_stats]; 
				return response()->json($data);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
			
		}
		
		
}
