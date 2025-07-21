<?php

namespace App\Http\Controllers\User; 

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller; 
use Illuminate\Http\Request; 

use Carbon\Carbon;
use App\Events\AddNewStories; 
use App\Events\StoryLikeEvent; 
use App\Events\StoryCommentEvent; 
use App\Events\StoryDeleteEvent; 

use App\Models\User; 
use App\Models\Stories; 
use App\Models\StoriesComment; 

use JWTAuth;
use Exception;

use App\Traits\GenerateThumbnailTrait;

class StoriesController extends Controller
{
	//trait for generating thumnail
	use GenerateThumbnailTrait;
	
	// Define the maximum number of stories allowed per user globally
    protected $maxStories = 10;

	//function to uplaod or add new stories
	function addNewStories(Request $request)
	{
		// Validate the incoming data
				$request->validate([ 
					'story_file' => 'required|mimes:jpg,jpeg,png,mp4|max:10240', // 10MB

        ]);
      
			
		try
		{  
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			
			
			// Check the user's current number of stories
			$userStoriesCount = $user->stories()->where('expires_at', '>', now())->count();

			if ($userStoriesCount >= $this->maxStories) {
					return response()->json([
							'status' => false,
							'message' => "You can only upload up to $this->maxStories stories.",
							'storyLimitReach' => true,
							 
					] );
			}
			
			
			$newStories = new Stories();
			$newStories->user_id = $user->id; 
			$newStories->expires_at = now()->addHours(24);
			$newStories->save();
						
			// Handle file upload 
			if ($request->hasFile('story_file')) 
			{
				$fileExtension = $request->file('story_file')->extension();
				$attachmentFileName = 'stories_'.$newStories->id.'_file.'.$fileExtension;
				//$request->file('story_file')->move(public_path('stories_file/'),$attachmentFileName );
				$request->file('story_file')->storeAs('stories_file', $attachmentFileName, 'public');
				
				$newStories->story_file = $attachmentFileName; 
				$newStories->save();
				
					if($fileExtension == 'mp4')
					{
						$videoPath = storage_path('app/public/stories_file/' . $attachmentFileName);
						$thumbnailPath = storage_path('app/public/stories_thumbnail/stories_' . $newStories->id . '_file.png');
					 
						// Generate thumbnail for video
						//	$this->generateVideoThumbnail(public_path('stories_file/'.$attachmentFileName), 'stories_thumbnail/stories_'.$newStories->id.'_file'.'.png');
						$this->generateVideoThumbnail($videoPath, $thumbnailPath);
						
						
						//geting full url of file 
						$thumbnailFileName = pathinfo($newStories->story_file, PATHINFO_FILENAME) . '.png';
            $newStories->story_file = url(Storage::url( 'stories_thumbnail/' . $thumbnailFileName));
						
					}
					else					
					{ 
							if (!filter_var($newStories->story_file, FILTER_VALIDATE_URL)) {
									$newStories->story_file = $newStories->story_file
											? url(Storage::url('stories_file/' . $newStories->story_file))
											: null;
							}
						
					}
				
				}
				
			
			   
									
			$newStoriesData = $newStories->only(['id', 'story_file', 'created_at', 'user_id', 'created_at_human_readable']);
			  
			//dispach event for real time updation
		 	AddNewStories::dispatch( 
				$newStoriesData
			);		 	
			
			// Return the posts as a JSON response
			$data = ['status' => true,'message'=> 'Story is uploaded successfully.', 'newStories'=>$newStoriesData]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			 $data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	//function to fetch list of user has stories    
	function getUserHasStories(Request $request)
	{
		try
		{  
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			
			// Retrieve the IDs of the users whom the authenticated user is following
			$followingIds = $user->following()->pluck('following_id');
		  
			// Retrieve stories  
		 $usersWithStories = User::whereIn('id', $followingIds)
            ->whereHas('stories', function ($query) {
                $query->where('expires_at', '>', now());  // Filter out expired stories
            })// Ensures the user has at least one story
            ->with([ 
                'stories' => function ($query) {
                    $query->select('id', 'user_id','story_file', 'created_at')  
													->where('expires_at', '>', now()) 
                          ->latest('created_at') // Get the latest story
                         ->take(1);
                }
            ])
            ->select('id',  'name') // Select required user fields
            ->cursorPaginate(20); // Paginate result
					 
			foreach ($usersWithStories as $story) 
			{
				
				if (empty($story->stories) || !isset($story->stories[0]) || empty($story->stories[0]->story_file)) {
						continue;  
				}

				$fileExtension = pathinfo($story->stories[0]->story_file, PATHINFO_EXTENSION) ?? null;

				 
					 
				if($fileExtension == 'mp4')
				{
					$thumbnailFileName = pathinfo($story->stories[0]->story_file, PATHINFO_FILENAME) . '.png';
					$story->stories[0]->story_file = url(Storage::url('stories_thumbnail/' . $thumbnailFileName));
					continue;
					
				}
				  
				if (!filter_var($story->stories[0]->story_file, FILTER_VALIDATE_URL)) {
						$story->stories[0]->story_file = $story->stories[0]->story_file
								? url(Storage::url('stories_file/' . $story->stories[0]->story_file))
								: null;
				} 
			}			
			
			// Return the posts as a JSON response
			$data = ['status' => true,'message'=> 'List of stories is  ready.', 'storiesList'=>$usersWithStories]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	function getLoggedUserStories(Request $request)
	{
    try {
        // Retrieve the authenticated user from the JWT token
        $user = JWTAuth::parseToken()->authenticate();
        $user_id = $user->id;

        // Retrieve the latest story of the logged-in user
        $story = Stories::select('id', 'story_file',   'created_at', 'user_id')
            ->where('user_id', $user_id) 
						->where('expires_at', '>', now()) 
            ->latest('created_at') // Order by the latest story
            ->first(); // Fetch only the most recent one

        // Check if a story exists
        if ($story) {
					
					
					$fileExtension = !empty($story->story_file) && is_string($story->story_file) 
											? pathinfo($story->story_file, PATHINFO_EXTENSION) 
											: null;
					if($fileExtension == null)
					{
						$story->story_file = null;
					} 
					else 
					{
					 
						if($fileExtension == 'mp4')
						{
							$thumbnailFileName = pathinfo($story->story_file, PATHINFO_FILENAME) . '.png';
							$story->story_file = url(Storage::url('stories_thumbnail/' . $thumbnailFileName));
							
						}
						else
						{ 
							if (!filter_var($story->story_file, FILTER_VALIDATE_URL)) {
									$story->story_file = $story->story_file
											? url(Storage::url('stories_file/' . $story->story_file))
											: null;
							}
							
							
						}
						 
					}
				

			 	
            $data = [
                'status' => true,
                'message' => 'Latest story is ready.',
                'story' => $story
            ];
        } else {
            $data = [
                'status' => true,
                'message' => 'No story found for the logged-in user.'
            ];
        }
				
				//fetch total stories
				$storyCount = $user->stories()->where('expires_at', '>', now())->count();
				$canAddStory = true;
				
				//check logged user can add new stories or not
				if ($storyCount >= $this->maxStories) {
						$canAddStory = false;
				}
				
				$data['canAddStory'] = $canAddStory;
				
				
        return response()->json($data);
    } catch (Exception $e) {
        $data = ['status' => false, 'message' => $e->getMessage()];
        return response()->json($data);
    }
	}

	
	//function to fetch signle story detail
	function getStoryDetail(Request $request)
	{
		try
		{  
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			
		
			 // Retrieve stories from users 
			 $storyDetail = User::where('id', $request->user_id) 
            ->with([ 
								'customer:id,user_id,image',
                'stories' => function ($query) use ($user) {
									 $query->where('expires_at', '>', now())
										 ->withCount([
											'likes as likes_count', // Count total likes
											'comments as comments_count' // Count total comments
										])->withExists([
											'likes as has_liked' => function ($likeQuery) use ($user)  {
											$likeQuery->where('user_id', $user->id); // Check if the story has a like from the given user
											}
									]);
								}
            ])
            ->select('id',  'name', 'userID')  
            ->first();  
					 
					 
			//getting full url of files
			foreach($storyDetail->stories as $story)
			{
				if (empty($story->story_file)) {
						continue;  
				}
				
				$fileExtension = pathinfo($story->story_file, PATHINFO_EXTENSION) ?? null;

				 if($fileExtension == null)
				 {
					 continue;
				 }
				 
				if($fileExtension == 'mp4')
				{  
					$story->story_file_type = 'mp4';
				}
				else
				{ 
					$story->story_file_type = 'image';
				}
				
				if (!filter_var($story->story_file, FILTER_VALIDATE_URL)) {
						$story->story_file = $story->story_file
								? url(Storage::url('stories_file/' . $story->story_file))
								: null;
				}
					 
			}
 
			if (!filter_var($storyDetail->customer->image, FILTER_VALIDATE_URL)) {
					$storyDetail->customer->image = $storyDetail->customer->image
							? url(Storage::url('profile_image/' . $storyDetail->customer->image))
							: null;
			}

			// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Story detail is ready.', 'storyDetail'=>$storyDetail]; 
				return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	 
	
	//function to delete Stories
	function deleteStories(Request $request)
	{
		try
		{  
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			$latestStoryId = Stories::select('id')
						->where('user_id', $user->id)
						->where('expires_at', '>', now()) 
            ->latest('created_at')  
            ->first();
						
			$stories = Stories::findOrFail($request->id); 
				
				if (!$stories) {
					$data = ['status' => false,'message'=> 'Stories is not found']; 
					return response()->json($data);
				}

 			 
				// Delete video
				if(!empty($stories->story_file))
				{
					$filename = $stories->story_file;
					$fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
          $fileNameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
           
					// Check if the file is a video
          if ($fileExtension === 'mp4') 
					{ 
						$thumbnailFilePath = 'stories_thumbnail/' . $fileNameWithoutExt.'.png';
						if (Storage::disk('public')->exists($thumbnailFilePath)) {  
                Storage::disk('public')->delete($thumbnailFilePath);
						} 		
					}
				
           
					$filePath = 'stories_file/' . $filename;
					if (Storage::disk('public')->exists($filePath)) {  
                Storage::disk('public')->delete($filePath);
					}
						
				} 
				// Delete the problem record
				$stories->delete();
			 
			$latestStory = null;
			//check the deleted story is latest or not
			if($latestStoryId != null && $latestStoryId->id == $request->id)
			{
				$latestStory = Stories::select('id', 'story_file', 'created_at', 'user_id')
						->where('user_id', $user->id)
						->where('expires_at', '>', now()) 
            ->latest('created_at')  
            ->first();
						
				//get  full url of file
				$fileExtension = pathinfo($latestStory->story_file, PATHINFO_EXTENSION) ?? null;
				
				if($fileExtension == 'mp4')
				{
					$thumbnailFileName = pathinfo($latestStory->story_file, PATHINFO_FILENAME) . '.png';
					$latestStory->story_file = url(Storage::url('stories_thumbnail/' . $thumbnailFileName));
					
				}
				else
				{ 
					if (!filter_var($latestStory->story_file, FILTER_VALIDATE_URL)) {
							$latestStory->story_file = $latestStory->story_file
									? url(Storage::url('stories_file/' . $latestStory->story_file))
									: null;
					}
					
					
				}
				  
			}
			
			
				
				
			$storyCount = Stories::where('user_id', $user->id)
						->where('expires_at', '>', now()) 
            ->count();
			
			
			//dispach event for real time updation
				StoryDeleteEvent::dispatch( 
					 [
						 'story_id'=>$request->id, 
						 'user_id'=>$user->id, 
						 'latestStory'=>$latestStory,					 
						 'storyCount'=>$storyCount,					 
					 ] 
				 );
				
				
				
			// Return the posts as a JSON response
			$data = [
			'status' => true,
			'message'=> 'Story is deleted successfully.',
			'stories_id'=>$request->id, 
			'user_id'=>$user->id, 
			'latestStory'=>$latestStory,
			'storyCount'=>$storyCount,
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
	
	//function to like a Stories
	function likeStories(Request $request)
	{
		try
		{  
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			 
        // Find the story by ID
        $story = Stories::findOrFail($request->story_id);

        // Check if the user has already liked the story
        $existingLike = $story->likes()->where('user_id', $user->id)->first();
				$data = [];
        if ($existingLike) {
            // If already liked, remove the like (toggle functionality)
            $existingLike->delete();

            $data = [
                'status' => true,
                'message' => 'Story unliked successfully.',
                'liked' => false, // Return the like status
            ];
        } else {
            // If not liked, create a new like
            $story->likes()->create(['user_id' => $user->id]);

            $data = [
                'status' => true,
                'message' => 'Story liked successfully.',
                'liked' => true, // Return the like status
            ];
        }
				$data['user_id']= $user->id;
				$data['story_id']= $request->story_id;
				$data['likes_count']= Stories::findOrFail($request->story_id)->likes()->count();
				//dispach event for real time updation
				StoryLikeEvent::dispatch( 
					 $data 
				 );
			 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	
	//function to fetch comment on Stories
	function getStoriesComments(Request $request)
	{
		try
		{  
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			 
			// Find the story by ID
			$story = Stories::findOrFail($request->story_id); 
			$comments = null; 
			
			
			// Check if the logged-in user is the story owner
			if ($story->user_id == $user->id) {
				
				
					// If the user is the story owner, fetch all comments on the story
					$comments = StoriesComment::where('stories_id', $story->id)
							->with([
								'user:id,userID,name', 
								'user.customer:id,user_id,image',
								]) 
							->orderBy('id', 'desc')
							->cursorPaginate(10); 
							
			} else {
				
					// If the user is not the story owner, fetch only their comments
					$comments = StoriesComment::where('stories_id', $story->id)
							->where('user_id', $user->id)
							->with([
									'user:id,userID,name', 
									'user.customer:id,user_id,image',
								]) 
							->orderBy('id', 'desc')
							->cursorPaginate(10); 
							
			}
			
			foreach($comments as $comment)
			{
				if (!filter_var($comment->user->customer->image, FILTER_VALIDATE_URL)) {
						$comment->user->customer->image = $comment->user->customer->image
								? url(Storage::url('profile_image/' . $comment->user->customer->image))
								: null;
				} 
			}

			$data = ['status' => true,'message'=> 'Comment of story is ready.',  'storyComment' => $comments, ];
        			 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}
	
	
	//function to upload comment on Stories
	function uploadStoriesComment(Request $request)
	{
		try
		{  
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			 
			//upload new Comment 
				$newComment = StoriesComment::create([ 'stories_id'=>$request->story_id, 'user_id'=>$user->id, 'comment' => $request->comment]);
				
				// Dynamically load additional relationships and aggregates
			$newComment->load([
					'user:id,userID,name', 
					'user.customer:id,user_id,image'
			]);
			 
			 //getting full url of file
			if (!filter_var($newComment->user->customer->image, FILTER_VALIDATE_URL)) {
						$newComment->user->customer->image = $newComment->user->customer->image
								? url(Storage::url('profile_image/' . $newComment->user->customer->image))
								: null;
				} 
			 
			$newCommentData = $newComment->only(['id', 'stories_id','user_id','comment', 'created_at', 'created_at_human_readable']);
			$newCommentData['user'] = $newComment->user; 
			$newCommentData['new'] = true; 
			$comments_count = StoriesComment::where('stories_id', $request->story_id)->count(); 
			
			//dispach event for real time updation
			StoryCommentEvent::dispatch( 
				 ['newComment'=>$newCommentData, 'comments_count'=>$comments_count ]
			 );
			 
			$data = ['status' => true,'message'=> 'Comment is upload successfully.','newComment'=>$newCommentData, 'comments_count'=>$comments_count  ];
        			 
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
