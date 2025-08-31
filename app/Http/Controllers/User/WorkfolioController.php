<?php

namespace App\Http\Controllers\User;


use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Events\WorkfolioAvgAndCountUpdate;
use App\Events\WorkfolioReviewAdd;
use App\Events\WorkfolioDeleted; 
use App\Events\AddNewWorkfolio;  

use App\Models\User; 
use App\Models\Workfolio; 
use App\Models\WorkfolioReview;  
use App\Models\WorkfolioSave;  
use JWTAuth;
use Exception;

class WorkfolioController extends Controller
{
    //function for add new Work
		function addNewWork(Request $request)
		{
			
			 // Validate the incoming data
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
						'tags' => 'required|array', 
            'images.*' => 'nullable|image|mimes:jpg,png,jpeg',  
            'video' => 'nullable|mimes:mp4|max:512000', // max 500MB for video
            'other' => 'nullable|mimes:zip,pdf|max:512000', // max 100MB for other files
        ]);
				
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
			
				$workfolio = new Workfolio();
        $workfolio->user_id = $user->id; // Assuming the user is authenticated
        $workfolio->title = $request->input('title');
        $workfolio->description = $request->input('description');
        $workfolio->tags = $request->input('tags', []);  
        $workfolio->save();
				
				
				//handle iages uploaded
				$images = $request->file('images');
				$imagesPath = [];
				
				$imageFileCount = 1;
				if ($request->hasFile('images')) 
				{
					foreach ($images as $file) 
					{ 
						$imageFileName = 'work_'.$workfolio->id.'_fileNo_'.$imageFileCount.'_image.'.$file->extension();
						//$file->move(public_path('workfolio_image/'), $imageFileName); 
						$file->storeAs('workfolio_image', $imageFileName, 'public');

						$imagesPath[] = $imageFileName;
						$imageFileCount++;
				
						
					}
				}
				// Handle video upload
        $videoPath = null;
        if ($request->hasFile('video')) 
				{
					$videoFileName = 'work_'.$workfolio->id.'_video.'.$request->file('video')->extension();
         // $request->file('video')->move(public_path('workfolio_video/'),$videoFileName ); 
					$request->file('video')->storeAs('workfolio_video', $videoFileName, 'public');

					$videoPath = $videoFileName;
				  
        }

        // Handle other file upload (zip, pdf)
        $otherFilePath = null;
        if ($request->hasFile('other')) 
				{ 
					$otherFileName = 'work_'.$workfolio->id.'_other.'.$request->file('other')->extension();
					//$request->file('other')->move(public_path('workfolio_otherfile/'),$otherFileName );
					$request->file('other')->storeAs('workfolio_otherfile', $otherFileName, 'public');
					
					$otherFilePath = $otherFileName;
				  
        } 
				
				//update workfolio Models
				$workfolio->images = $imagesPath;
				$workfolio->video = $videoPath;
        $workfolio->other = $otherFilePath; 
        $workfolio->save();
				
			// Dynamically load additional relationships and aggregates
        $workfolio->load([
            'user:id,userID',  
						 'user.customer:id,user_id,image', 
        ]);
        $workfolio->loadAvg('workfolioReview', 'rating'); // Load average rating
        $workfolio->loadCount('workfolioReview'); // Load count of reviews
        $workfolio->has_saved = false;
					  
			
				//getting full profile image url of owner
				$workfolio->user->customer->image = $workfolio->user->customer->image
				? url(Storage::url('profile_image/' . $workfolio->user->customer->image))  
				: null;			

				 // Filter only required fields
        $newWorkfolio = $workfolio->only(['id', 'title', 'created_at', 'created_at_human_readable', 'user_id']);
        $newWorkfolio['user'] = $workfolio->user; // Add user relationship
        $newWorkfolio['workfolio_review_avg_rating'] = $workfolio->workfolio_review_avg_rating; // Add avg rating
        $newWorkfolio['workfolio_review_count'] = $workfolio->workfolio_review_count; // Add review count

				 
				
				//dispach event for real time updation
					AddNewWorkfolio::dispatch($newWorkfolio);
				 
				
				
				// Return the response as a JSON response
				$data = ['status' => true,'message'=>'Work is uploaded successfully', 'newWorkfolio'=>$newWorkfolio ]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status'=>false, 'message'=>$e->getMessage()];
				return response()->json($data);
			}
		}

	


	//function for get list of works of following user  
		function getInterestedWorkfolio(Request $request){
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
			
				// Retrieve the IDs of the users whom the authenticated user is following
        $followingIds = $user->following()->pluck('following_id');
				
				$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
				
         
				$followingWork = Workfolio::select('id', 'title',   'created_at', 'user_id') 
        ->with([
						'user:id,userID', 
						'user.customer:id,user_id,image', 
        ])
				->withAvg('workfolioReview', 'rating')->withCount('workfolioReview')
				->withExists(['savedWorkfolio as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
				->orderBy('id', 'desc')
				->where('user_id', '!=', $user->id) // Ensure user does not see their own posts
				->where(function ($query) use ($userInterests, $followingIds) {
					if (!empty($userInterests)) {
						foreach ($userInterests as $interest) {
							$query->orWhereJsonContains('tags', $interest);
						}
					}

					if (!$followingIds->isEmpty()) {
						$query->orWhereIn('user_id', $followingIds);
					}
				})
				->cursorPaginate(10); 
				 
         
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
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Workfolio List is ready.', 'workList'=>$followingWork]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}
	
	
	
	
	//function for get list of work of particuller user or logged user
	function getUserWorkfolio(Request $request){
		try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
					 
					$user_id = null;
					if($request->userId == null)
					{
						$user_id = $user->id;
					}
					else{
						$user_id = $request->userId;
					}
					
        // Retrieve posts from users whom the authenticated user is following
          
			 $works = Workfolio::select('id', 'title',   'created_at', 'user_id')
					->where('user_id', $user_id)
        ->with([
						'user:id,userID,name', 
						 'user.customer:id,user_id,image', 
        ])
				->withAvg('workfolioReview', 'rating')
				->withCount('workfolioReview')
				->withExists(['savedWorkfolio as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
				->orderBy('id', 'desc')->cursorPaginate(10); 
				 
        foreach ($works as $workfolio) 
				{
						 
					if (!filter_var($workfolio->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				
						//getting full profile image url of owner
						$workfolio->user->customer->image = $workfolio->user->customer->image
						? url(Storage::url('profile_image/' . $workfolio->user->customer->image))  
						: null;
					}
					
				} 
 
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Workfolio List is ready.', 'workList'=>$works ]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}
	
	
	
	//function for fetching saved workfolios
	function getSavedWorkfolio(Request $request)
	{
		try
		{
			
			// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$works = Workfolio::select('id', 'title',   'created_at', 'user_id') 
					 ->whereHas('savedWorkfolio', function ($query) use ($user) {
                        $query->where('user_id', $user->id); // Filter by saved Workfolio                   
            })
        ->with([
						'user:id,userID', 
						 'user.customer:id,user_id,image', 
        ])
				->withAvg('workfolioReview', 'rating')
				->withCount('workfolioReview')
				->withExists(['savedWorkfolio as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
				->orderBy('id', 'desc')->cursorPaginate(10); 
				 
        foreach ($works as $workfolio) 
				{
						 
					if (!filter_var($workfolio->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				
						//getting full profile image url of owner
						$workfolio->user->customer->image = $workfolio->user->customer->image
						? url(Storage::url('profile_image/' . $workfolio->user->customer->image))  
						: null;
					}
					
				} 
			
			// Return the posts as a JSON response
			$data = ['status' => true,'message'=> 'Workfolio List is ready.', 'workList'=>$works ]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
		}
	}
	
	
	
	//function for get list of posts of particuller user or logged user
	function getWorkfolioDetail(Request $request){
		try
			{ 
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
        // Retrieve posts from users whom the authenticated user is following
				$workfolioDetail = Workfolio::select('id', 'title', 'description', 'tags', 'images', 'video', 'other', 'created_at', 'user_id')
				->with([
					'user:id,userID',
					'user.customer:id,user_id,image', 				
				])
				->withAvg('workfolioReview', 'rating')  
				->withCount('workfolioReview') 
				->withExists(['savedWorkfolio as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
				->findOrFail($request->id); 

				//getting full profile image url 
				if(!filter_var($workfolioDetail->user->customer->image, FILTER_VALIDATE_URL)) 
				{ 				 
					$workfolioDetail->user->customer->image = $workfolioDetail->user->customer->image
					? url(Storage::url('profile_image/' . $workfolioDetail->user->customer->image))  
					: null;
				}
				//getting full video
				if(!filter_var($workfolioDetail->video, FILTER_VALIDATE_URL)) 
				{ 				 
					$workfolioDetail->video = $workfolioDetail->video
					? url(Storage::url('workfolio_video/' . $workfolioDetail->video))  
					: null;
				}
				$updatedImages = [];
				foreach ($workfolioDetail->images as $image) 
				{ 	 
					//getting full   image url 
					if(!filter_var($image, FILTER_VALIDATE_URL)) 
					{ 				 
						$imageUrl = $image
						? url(Storage::url('workfolio_image/' . $image))  
						: null;
						$updatedImages[] = $imageUrl;
					}
					
				} 
				$workfolioDetail->images = $updatedImages;
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Workfolio detail is ready.', 'workfolioDetail'=>$workfolioDetail]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}
	

	
	
	//function for save and remove workfolio from save
	function saveWorkfolio(Request $request)
	{
		try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$has_saved = true;
			 
				$save = WorkfolioSave::where('user_id', $user->id)->where('workfolio_id',$request->workfolio_id)->first();
				if($save)
				{
					$save->delete();
					$has_saved =  false;
				}
				else
				{
					$createSave = WorkfolioSave::create(['user_id'=>$user->id, 'workfolio_id'=>$request->workfolio_id]);
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
	
	
	//function for downloading assignment attachment
	function downloadWorkfolioOtherFile(Request $request)
	{ 
		try
		{
			// fetch assignment detail
			$workfolio = Workfolio::select('id', 'other')->findOrFail($request->id); 
			$filename =  $workfolio->other;
			/*
			$filePath = public_path('workfolio_otherfile/' . $filename);

			// Check if file exists
			if (!file_exists($filePath)) {
					return abort(404, 'File not found');
			}

			// Return file as download
			return response()->download($filePath);
		 */
		 
		 
				$filePath = 'workfolio_otherfile/' . $filename;

				if (Storage::disk('public')->exists($filePath)) {
            return Storage::disk('public')->download($filePath);
        } else {
            return response()->json(['error' => 'File not found'], 404);
        }
				
				
				
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}  
	}
	
	
	//function to handle deletion of workfolio
	function deleteWorkfolio(Request $request)
	{
		try
		{
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			
			$workfolio = Workfolio::findOrFail($request->id); 
			
			if (!$workfolio) {
				$data = ['status' => false,'message'=> 'Workfolio is not found']; 
				return response()->json($data);
			}

			// Delete images
			if ($workfolio->images != null) {
					foreach ($workfolio->images as $image) {
						$imagePath = 'workfolio_image/' . $image;
							if (Storage::disk('public')->exists($imagePath)) {  
                Storage::disk('public')->delete($imagePath);
							} 
					}
			}

			// Delete video
			if(!empty($workfolio->video))
			{ 
				$videoPath = 'workfolio_video/' . $workfolio->video;
							if (Storage::disk('public')->exists($videoPath)) {  
                Storage::disk('public')->delete($videoPath);
							}  
			} 

			
			// Delete other files
			if(!empty($workfolio->other))
			{
				$otherFilePath = 'workfolio_otherfile/' . $workfolio->other;
							if (Storage::disk('public')->exists($otherFilePath)) {  
                Storage::disk('public')->delete($otherFilePath);
							}   
			}
				 

			// Delete the workfolio record
			$workfolio->delete();
			
			//dispach event for real time updation
			WorkfolioDeleted::dispatch( 
				 ['workfolio_id'=>$request->id, 'user_id'=>$user->id] 
			 );
			 
			$data = ['status' => true,'message'=> 'Workfolio is deleted successfully.', 'workfolio_id'=>$request->id]; 
			return response()->json($data);
						
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			 $data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}  
	}



	//function for add review of workfolio
	function addWorkfolioReview(Request $request)
	{
		// Validate the incoming request
        $request->validate([ 
            'workfolio_id' => 'required|exists:workfolios,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
        ]);
		try
		{
			// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
			
			// Create the review
        $review = WorkfolioReview::create([
            'user_id' => $user->id,
            'workfolio_id' => $request->workfolio_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
        ]);
			// Load the related data for the created review
			$review->load([
					'user:id,userID',
					'user.customer:id,user_id,image',
			]);
			
			if (!filter_var($review->user->customer->image, FILTER_VALIDATE_URL)) 
			{ 				
				//getting full profile image url of owner
				$review->user->customer->image = $review->user->customer->image
				? url(Storage::url('profile_image/' . $review->user->customer->image))  
				: null;
			}
			
					
					
			//get avarage anf count of workfolio rating
			$workfolioAvgANDCount = Workfolio::select('id','created_at')
			->withAvg('workfolioReview', 'rating')
			->withCount('workfolioReview')
			->findOrFail($request->workfolio_id); 
			
			//Dispatching event
			$reviewArray = $review->toArray();
		 	WorkfolioReviewAdd::dispatch( 
					 $reviewArray 
				 );    
			$workfolioAvgANDCountArray = $workfolioAvgANDCount->toArray();
			// Manually add the user_id to the array
      $workfolioAvgANDCountArray['user_id'] = $user->id;
			WorkfolioAvgAndCountUpdate::dispatch( 
					 $workfolioAvgANDCountArray
				 );   
			
			
			$data = ['status' => true,'message'=> 'Workfolio review is added successfully.', 'newReview'=>$review, 'workfolioAvgANDCount'=>$workfolioAvgANDCount]; 
			return response()->json($data);
						
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			 $data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}  
		
	}


	//function for get review of workfolio
	function getWorkfolioReview(Request $request)
	{
		 
		try
		{
			// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
			
				 $reviews = WorkfolioReview::select('id', 'workfolio_id', 'rating', 'comment','created_at', 'user_id')
					->where('workfolio_id', $request->workfolio_id)
					->with([
						'user:id,userID', 
						'user.customer:id,user_id,image', 
					]) 
					->orderBy('id', 'desc')->cursorPaginate(10); 
				 
          
				foreach ($reviews as $review) 
				{
						 
					if (!filter_var($review->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 				
						//getting full profile image url of owner
						$review->user->customer->image = $review->user->customer->image
						? url(Storage::url('profile_image/' . $review->user->customer->image))  
						: null;
					}
					
				}
 
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Workfolio List is ready.', 'reviews'=>$reviews]; 
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
