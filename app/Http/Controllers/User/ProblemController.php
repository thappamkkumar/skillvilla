<?php
namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;  
use Illuminate\Http\Request;

use Illuminate\Support\Facades\Validator;

use App\Events\AddNewProblem; 
use App\Events\ProblemDelete; 
use App\Events\ProblemSolutionCountUpdate; 
use App\Events\ProblemSolutionAdd; 
use App\Events\ProblemSolutionDelete; 


use App\Models\Problem; 
use App\Models\ProblemSolution; 
use App\Models\ProblemSave; 
 
use JWTAuth;
use Exception;

class ProblemController extends Controller
{
	
    //function to add new problem
		function addNewProblem(Request $request){
				// Validate the incoming data
				$request->validate([
            'title' => 'required|string|max:255',
					'description' => 'required|string', 
					'attachment' => 'nullable|mimes:jpg,jpeg,png,pdf,zip',  
					'url' => 'nullable|url',  
        ]);
      
				try
				{
					// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
				
					$newProblem = new Problem();
					$newProblem->user_id = $user->id; // Assuming the user is authenticated
					$newProblem->title = $request->input('title');
					$newProblem->description = $request->input('description');
					if($request->input('url') == null || empty($request->input('url')))
					{
						$newProblem->url = null; 
					}
					else
					{
						$newProblem->url = $request->input('url'); 
					}
					$newProblem->save();
					
					// Handle attachment upload 
					if ($request->hasFile('attachment')) 
					{
						$attachmentFileName = 'problem_'.$newProblem->id.'_attachment.'.$request->file('attachment')->extension();
						//$request->file('attachment')->move(public_path('problem_attachment/'),$attachmentFileName ); 
						$request->file('attachment')->storeAs('problem_attachment', $attachmentFileName, 'public');

						$newProblem->attachment = $attachmentFileName; 
						$newProblem->save();
					}
					 
					 
					// Dynamically load additional relationships and aggregates
					$newProblem->load([
							'user:id,userID',  
							 'user.customer:id,user_id,image', 
					]);
					$newProblem->loadCount('solutions'); // Load count of solutions
					$newProblem->has_saved = false;
					
					
					//getting full profile image url of owner
					$newProblem->user->customer->image = $newProblem->user->customer->image
					? url(Storage::url('profile_image/' . $newProblem->user->customer->image))  
					: null;			

				 // Filter only required fields
					$newProblemData = $newProblem->only(['id', 'title', 'created_at', 'created_at_human_readable', 'user_id']);
					$newProblemData['user'] = $newProblem->user;  
					$newProblemData['solutions_count'] = $newProblem->solutions_count;  
				 
				 //dispach event for real time updation
					AddNewProblem::dispatch($newProblemData);
				 
					
					// Return the posts as a JSON response
					// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Problem is uploaded successfully.', 'newProblem'=>$newProblemData]; 
					return response()->json($data);
				}
				catch(Exception $e)
				{
					//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
					 $data = ['status' => false,'message'=> $e->getMessage()];
					return response()->json($data);
				}
		}
	
	
		//function for fetch problem of  following user  
		function getInterestedProblems(Request $request){
				try
				{
					// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
				
					// Retrieve the IDs of the users whom the authenticated user is following
					$followingIds = $user->following()->pluck('following_id');
					
					$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
				
					 
					$followingProblem = Problem::select('id', 'title',   'created_at', 'user_id') 
					->where('user_id', '!=', $user->id) // Ensure user does not see their own posts
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
					->with([
							'user:id,userID',
							'user.customer:id,user_id,image', 							
					])
					->withCount('solutions') 
					->withExists(['savedProblem as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
					->orderBy('id', 'desc')
					->cursorPaginate(10); 
					 
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
	 
					
					// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Problem List is ready.', 'problemList'=>$followingProblem]; 
					return response()->json($data);
				}
				catch(Exception $e)
				{
					$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
					//$data = ['status' => false,'message'=> $e->getMessage()];
					return response()->json($data);
				}
		}
	
	
		//function for get list of problem of particuller user or logged user
		function getUserProblems(Request $request){
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
					 
				 $problems = Problem::select('id', 'title',   'created_at', 'user_id')
					->where('user_id', $user_id)
					->with([
							'user:id,userID,name',
							'user.customer:id,user_id,image', 							
					])
					->withCount('solutions') 
					->withExists(['savedProblem as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
					->orderBy('id', 'desc')->cursorPaginate(10); 
					 
					foreach ($problems as $problem) 
					{ 
						if (!filter_var($problem->user->customer->image, FILTER_VALIDATE_URL)) 
						{ 				
							//getting full profile image url of owner
							$problem->user->customer->image = $problem->user->customer->image
							? url(Storage::url('profile_image/' . $problem->user->customer->image))  
							: null;
						}
						
					} 
	 
					
					// Return the posts as a JSON response
					$data = ['status' => true,'message'=> 'Problem List of user is ready.', 'problemList'=>$problems]; 
					return response()->json($data);
				}
				catch(Exception $e)
				{
					//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
					$data = ['status' => false,'message'=> $e->getMessage()];
					return response()->json($data);
				}
		}
		
	
		//function for fetching saved problems
		function getSavedProblems(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$problems = Problem::select('id', 'title',   'created_at', 'user_id') 
					->whereHas('savedProblem', function ($query) use ($user) {
                        $query->where('user_id', $user->id); // Filter by saved problem                   
            })
					->with([
							'user:id,userID',
							'user.customer:id,user_id,image', 							
					])
					 ->withCount('solutions')
				->withExists(['savedProblem as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])					 
					->orderBy('id', 'desc')->cursorPaginate(10); 
					 
					foreach ($problems as $problem) 
					{ 
						if (!filter_var($problem->user->customer->image, FILTER_VALIDATE_URL)) 
						{ 				
							//getting full profile image url of owner
							$problem->user->customer->image = $problem->user->customer->image
							? url(Storage::url('profile_image/' . $problem->user->customer->image))  
							: null;
						}
						
					} 
	 
				
				// Return the posts as a JSON response
				$data = ['status' => true, 'message'=> 'Problem List of user is ready.', 'problemList'=>$problems]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
	
		
		
	
		//function for save and remove problem from save
		function saveProblem(Request $request)
		{
			try
				{
					// Retrieve the authenticated user from the JWT token
					$user = JWTAuth::parseToken()->authenticate();
					
					$has_saved = true;
				 
					$save = ProblemSave::where('user_id', $user->id)->where('problem_id', $request->problem_id)->first();
					if($save)
					{
						$save->delete();
						$has_saved =  false;
					}
					else
					{
						$createSave = ProblemSave::create(['user_id'=>$user->id, 'problem_id'=>$request->problem_id]);
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
		
		
		// function to get problem detail
		function getProblemDetail(Request $request)
		{
			try{
				
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
			
			
			
				// Retrieve posts from users whom the authenticated user is following
				$problemDetail = Problem::select('id', 'title', 'description', 'attachment', 'url', 'created_at', 'user_id')
				->with([
        'user:id,userID',
				 'user.customer:id,user_id,image', 
				])   
				->withCount('solutions') 
				->withExists(['savedProblem as has_saved' => function ($query) use ($user) {
						$query->where('user_id', $user->id);
					}])
				->findOrFail($request->id); 


				//getting full profile image url 
				if(!filter_var($problemDetail->user->customer->image, FILTER_VALIDATE_URL)) 
				{ 				 
					$problemDetail->user->customer->image = $problemDetail->user->customer->image
					? url(Storage::url('profile_image/' . $problemDetail->user->customer->image))  
					: null;
				}
				//getting full video
				if(!filter_var($problemDetail->attachment, FILTER_VALIDATE_URL)) 
				{ 				 
					$problemDetail->attachment = $problemDetail->attachment
					? url(Storage::url('problem_attachment/' . $problemDetail->attachment))  
					: null;
				}
				
				
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Problem detail is ready.', 'problemDetail'=>$problemDetail]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
		}
		
	

	//function to handle deletion of problem
		function deleteProblem(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$problem = Problem::findOrFail($request->id); 
				
				if (!$problem) {
					$data = ['status' => false,'message'=> 'Problem is not found']; 
					return response()->json($data);
				}

				 
				// Delete video
				if(!empty($problem->attachment))
				{ 
					$attachmentPath = 'problem_attachment/' . $problem->attachment;
							if (Storage::disk('public')->exists($attachmentPath)) {  
                Storage::disk('public')->delete($attachmentPath);
							} 
				} 

				
			 //get problem solutions
			 $solutions = ProblemSolution::where('problem_id', $request->id)->get();
			 
			 foreach($solutions as $solution)
			 {
					if(!empty($solution->attachment))
					{ 
						$solutionAttachmentPath = 'problem_solution_attachment/' . $solution->attachment;
								if (Storage::disk('public')->exists($solutionAttachmentPath)) {  
									Storage::disk('public')->delete($solutionAttachmentPath);
								} 
					} 
				 
			 }
					 

				// Delete the problem record
				$problem->delete();
				
				//dispach event for real time updation
				ProblemDelete::dispatch( 
					 ['problem_id'=>$request->id, 'user_id'=>$user->id] 
				 );
				 
				$data = ['status' => true,'message'=> 'Problem is deleted successfully.', 'problem_id'=>$request->id]; 
				return response()->json($data);
							
			}
			catch(Exception $e)
			{
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				 $data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}  
		}

		
	

	//function to download attachmentFileName
		function downloadProblemAttachment(Request $request)
		{ 
			try
			{
				// fetch assignment detail
				$problem = Problem::select('id', 'attachment')->findOrFail($request->id); 
				$filename =  $problem->attachment;
				/*
				$filePath = public_path('problem_attachment/' . $filename);

				// Check if file exists
				if (!file_exists($filePath)) {
						return abort(404, 'File not found');
				}

				// Return file as download
				return response()->download($filePath);
			 */
			 
			 $filePath = 'problem_attachment/' . $filename;

				if (Storage::disk('public')->exists($filePath))
				{
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


		//function for add review of workfolio
		function addProblemSolution(Request $request)
		{
			// Validate the incoming request
					$request->validate([ 
							'problem_id' => 'required|exists:problems,id', 
							'solution' => 'string',
							'attachment' =>  'nullable|mimes:jpg,jpeg,png,pdf,zip',  
					]);
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				// Create the review
				
					
				$newProblemSolution = new ProblemSolution();
				$newProblemSolution->user_id = $user->id; // Assuming the user is authenticated
				$newProblemSolution->problem_id = $request->input('problem_id');
				$newProblemSolution->solution = $request->input('solution');
				 
				$newProblemSolution->save();
				
				// Handle attachment upload 
				if ($request->hasFile('attachment')) 
				{
					$attachmentFileName = 'problem_soultion_'.$newProblemSolution->id.'_attachment.'.$request->file('attachment')->extension();
					//$request->file('attachment')->move(public_path('problem_solution_attachment/'),$attachmentFileName ); 
					$request->file('attachment')->storeAs('problem_solution_attachment', $attachmentFileName, 'public');

					$newProblemSolution->attachment = $attachmentFileName; 
					$newProblemSolution->save();
					
					//getting full attachment
					$newProblemSolution->attachment = $newProblemSolution->attachment
					? url(Storage::url('problem_solution_attachment/' . $newProblemSolution->attachment))  
					: null;	
				
				
				}
					
				
					
					 
				// Load the related data for the created review
				$newProblemSolution->load([
						'user:id,userID,name',
						'user.customer:id,user_id,image',
				]);
				
				//getting full profile image url of owner
				$newProblemSolution->user->customer->image = $newProblemSolution->user->customer->image
				? url(Storage::url('profile_image/' . $newProblemSolution->user->customer->image))  
				: null;		
				
				
				//count solution for problem
				$problemSolutionCount = Problem::select('id', 'created_at') 
				->withCount('solutions') 
				->findOrFail($request->problem_id); 
				
				 
				//Dispatching event
				 $newProblemSolutionArray = $newProblemSolution->toArray();
				ProblemSolutionAdd::dispatch( 
						 $newProblemSolutionArray 
					 );  
				$problemSolutionCountArray = $problemSolutionCount->toArray();
				// Manually add the user_id to the array
				$problemSolutionCountArray['user_id'] = $user->id;
				ProblemSolutionCountUpdate::dispatch( 
						 $problemSolutionCountArray
					 );   
				
				 
				$data = ['status' => true,'message'=> 'Solution is added successfully.', 'newProblemSolution'=>$newProblemSolution,  'solutionCount'=>$problemSolutionCount] ; 
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
		function getProblemSolution(Request $request)
		{
		 
		try
		{
			// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
			
				 $solutions = ProblemSolution::select('id', 'problem_id',  'solution', 'attachment', 'created_at', 'user_id')
					->where('problem_id', $request->problem_id)
					->with([
						'user:id,userID,name', 
						'user.customer:id,user_id,image', 
					]) 
					->orderBy('id', 'desc')->cursorPaginate(10); 
				 
        	foreach ($solutions as $solution) 
					{ 
						if (!filter_var($solution->user->customer->image, FILTER_VALIDATE_URL)) 
						{ 				
							//getting full profile image url of owner
							$solution->user->customer->image = $solution->user->customer->image
							? url(Storage::url('profile_image/' . $solution->user->customer->image))  
							: null;
						}
						if (!filter_var($solution->attachment, FILTER_VALIDATE_URL)) 
						{ 				
							//getting full attachment url 
							$solution->attachment = $solution->attachment
							? url(Storage::url('problem_solution_attachment/' . $solution->attachment))  
							: null;
						}
						
						
					}
 
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Solutions List is ready.', 'solutions'=>$solutions]; 
				return response()->json($data);
			 
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			 $data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}  
		
	}

		


		//function to download problem solutions
		function downloadProblemSolutionAttachment(Request $request)
		{
			try
			{
				// fetch assignment detail
				$problemSolution = ProblemSolution::select('id', 'attachment')->findOrFail($request->id); 
				$filename =  $problemSolution->attachment;
				/*
				$filePath = public_path('problem_solution_attachment/' . $filename);

				// Check if file exists
				if (!file_exists($filePath)) {
						return abort(404, 'File not found');
				}

				// Return file as download
				return response()->download($filePath);
			 */
				$filePath = 'problem_solution_attachment/' . $filename;

				if (Storage::disk('public')->exists($filePath))
				{
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




		//function to delete problem solution
		function deleteProblemSolution(Request $request)
		{
			try
			{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();
				
				$problemSolution = ProblemSolution::findOrFail($request->id); 
				$problem_id=$problemSolution->problem_id;
				if (!$problemSolution) {
					$data = ['status' => false,'message'=> 'Problem is not found']; 
					return response()->json($data);
				}

				 
				// Delete video
				if(!empty($problemSolution->attachment))
				{ 
					$attachmentPath = 'problem_solution_attachment/' . $problemSolution->attachment;
							if (Storage::disk('public')->exists($attachmentPath)) {  
                Storage::disk('public')->delete($attachmentPath);
							} 
				} 
 
				// Delete the problem record
				$problemSolution->delete();
				
				//dispach event for real time updation
				ProblemSolutionDelete::dispatch( 
					 ['solution_id'=>$request->id, 'user_id'=>$user->id] 
				 );
				 
				 
					//count solution for problem
				$problemSolutionCount = Problem::select('id') 
				->withCount('solutions') 
				->findOrFail($problem_id);   
				$problemSolutionCountArray = $problemSolutionCount->toArray();// Manually add the user_id to the array
				//dispach event for real time updation
				$problemSolutionCountArray['user_id'] = $user->id;
				ProblemSolutionCountUpdate::dispatch( 
						 $problemSolutionCountArray
					 );   
				
				
				$data = ['status' => true,'message'=> 'Problem solution is deleted successfully.', 'solution_id'=>$problemSolution->id, 'solutionCount'=>$problemSolutionCount]; 
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
