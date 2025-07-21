<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;	
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\FreelanceBid; 
use App\Models\Freelance; 
use App\Models\HirerReview;  
use App\Models\User;  

use App\Events\FreelanceBidCountEvent;  
use App\Events\AddNewFreelanceBidEvent;  

use JWTAuth;
use Exception;

class FreelanceBidController extends Controller
{
    //function for add new bid on freelance work
		function placeBidForFreelanceWork(Request $request)
		{
			
			  // Validate the incoming data
			$request->validate([
					'freelance_id' => 'required|exists:freelances,id',
					'cover_letter' => 'required|string|min:10',
					'bid_amount' => 'required|numeric|min:1',
					'payment_type' => 'required|in:hourly,fixed,negotiable',
					'delivery_time' => 'required|string',
			]);
			
			
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$freelanceBid = FreelanceBid::create([
                'freelance_id' => $request->freelance_id,
                'user_id' => $user->id,
                'cover_letter' => $request->cover_letter,
                'bid_amount' => $request->bid_amount,
                'payment_type' => $request->payment_type,
                'delivery_time' => $request->delivery_time,
                'status' => 'submitted', // Default status
            ]); 
				
				
				// Dynamically load additional relationships and aggregates
        $freelanceBid->load([
            'user:id,userID,name',
            'user.customer:id,user_id,image',
        ]);
				
				//getting full profile image url of owner
				$freelanceBid->user->customer->image = $freelanceBid->user->customer->image
				? url(Storage::url('profile_image/' . $freelanceBid->user->customer->image))  
				: null;			
				
				
				// Prepare the updated freelance work data for response
        $freelanceBidData = $freelanceBid->only([
           'id','freelance_id', 'user_id','cover_letter', 'bid_amount', 'payment_type','delivery_time', 'status', 'created_at', 'created_at_human_readable'
        ]);
        $freelanceBidData['user'] = $freelanceBid->user;
        
				
				
				$freelance = Freelance::select('id','user_id')->withCount('bids')->findOrFail($request->freelance_id); 
				
				
				//dispach event for real time updation
				AddNewFreelanceBidEvent::dispatch($freelanceBidData);
				FreelanceBidCountEvent::dispatch(
				[
				'freelance_id'=>$freelance->id, 
				'freelance_user_id'=>$freelance->user_id,
				'bids_count'=>$freelance->bids_count,
				
				] 
				);
						
				
				
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Freelance bid submitted successfully.', 'freelanceBid'=>$freelanceBid]; 
					return response()->json($data);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		
		
		//function for get freelance bids
		function getFreelanceBids(Request $request)
		{
			
			 
			
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$data = [];
				if($request->has_freelance != null && $request->has_freelance)
				{
					$freelance = Freelance::select(['id','title','deadline','created_at'])->findOrFail($request->freelance_id);
					 // If job is not found, return an error response
					if (!$freelance) {
							return response()->json(['status' => false,'message'=> 'Freelance is not found.']);
					}
					  
					
					 // Fetch the bids statistics and store them in variables
					$totalBids = $freelance->bids()->count(); 

					// Add the statistics as custom attributes on the job object
					$freelance->totalBids = $totalBids; 
					$data['freelance'] = $freelance;
				}
				
				
				$freelanceBidList = FreelanceBid::select('id','freelance_id', 'user_id','cover_letter', 'bid_amount', 'payment_type','delivery_time', 'status', 'created_at')
					->where('freelance_id',$request->freelance_id)
					->with([
						'user' => function ($query) {
							$query->select('id', 'name', 'userID')
										->withCount('freelancerReviewsReceived as review_count')
										->withAvg('freelancerReviewsReceived as avg_rating', 'rating');
							},
						'user.customer:id,user_id,image',  
					])
					 
					->orderBy('id', 'desc')->cursorPaginate(10);
				  
				foreach($freelanceBidList as $freelanceBid) 
				{
						 
					if ($freelanceBid->user->customer != null && !filter_var($freelanceBid->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				
						//getting full profile image url 
						$freelanceBid->user->customer->image = $freelanceBid->user->customer->image
						? url(Storage::url('profile_image/' . $freelanceBid->user->customer->image))  
						: null;
					}
					
				}
				 
				$data['status'] = true;
				$data['freelanceBidList'] = $freelanceBidList;
				$data['message'] = 'List of freelance bids is ready.';
					
				return response()->json($data);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
			//function for update freelance bid status
		function updateFreelanceBidStatus(Request $request)
		{
			
			// Validate the incoming data
        $validated = $request->validate([
            'status' => 'required|string|in:submitted,in_review,shortlisted,accepted,rejected',
        ]); 
			
			try
			{
				
				// Retrieve the authenticated user from the JWT token
				//$user = JWTAuth::parseToken()->authenticate();
				
				$freelanceBid = FreelanceBid::findOrFail($request->bid_id);
				if (!$freelanceBid) {
							return response()->json(['status'=>false, 'message' => 'Freelance bid not found'], 404);
				}
				
				$freelanceBid->status = $request->status;
				$freelanceBid->save();
				
				
			 $data = ['status' => true, 'message' => 'Freelance bid status is updated successfully.'  ];
					
				return response()->json($data);
				
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
		
		//function for upload reviews on freelancer
		function uploadFreelancerReview(Request $request)
		{
			// Validate the incoming request
        $request->validate([  
            'freelancer_id' => 'required|exists:users,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
				
				
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				// Create the review
        HirerReview::create([
            'user_id' => $user->id,
            'freelancer_id' => $request->freelancer_id,
            'review' => $request->comment,
            'rating' => $request->rating,
        ]);
				
				$selectedFreelancer= User::findOrFail($request->freelancer_id);

        // Calculate freelancer review stats
         
				$review_stats = [
            'avg_rating' => $selectedFreelancer->freelancerReviewsReceived()->avg('rating') ?? 0,
            'review_count' => $selectedFreelancer->freelancerReviewsReceived()->count(), 
            'freelancer_id' => $request->freelancer_id,
        ];
				
				// Return the response as a JSON response
				$data = ['status' => true,'message'=> 'Freelancer review is add successfullly.',  'review_stats'=>$review_stats  ]; 
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
