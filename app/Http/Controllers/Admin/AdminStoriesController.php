<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Stories;
use JWTAuth;
use Exception;

class AdminStoriesController extends Controller
{
    //function for fetching stories 
		function getStoryList()
		{
			try
			{ 
			
				$storyList = Stories::select(['id', 'story_file', 'user_id', 'created_at'])
				->with(['user:id,userID'])
				->withCount([
											'likes as likes_count',  
											'comments as comments_count' 
										])
				->orderBy('id', 'desc')
				->cursorPaginate(25);
				
				foreach($storyList as $story)
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
						$thumbnailFileName = pathinfo($story->story_file, PATHINFO_FILENAME) . '.png';
						$story->story_file = url(Storage::url('stories_thumbnail/' . $thumbnailFileName));
						continue;
						
					}
						
					if (!filter_var($story->story_file, FILTER_VALIDATE_URL)) {
							$story->story_file = $story->story_file
									? url(Storage::url('stories_file/' . $story->story_file))
									: null;
					} 
				
				}
				
				return response()->json([
            'status' => true,
            'message' => 'Story list fetched successfully.',
            'storyList' => $storyList,
             
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}

		//function for fetching story detail
		function getStoryDetail(Request $request)
		{
			try
			{
				$story = Stories::select(['id', 'story_file', 'user_id', 'created_at']) 
				->with(['user:id,userID,name',
								'user.customer:id,user_id,image'
				])
				->withCount([
											'likes as likes_count',  
											'comments as comments_count' 
										])
				->where('id',$request->storyId)
				->first();
				
				$fileExtension = pathinfo($story->story_file, PATHINFO_EXTENSION) ?? null;

				if($fileExtension != null)
				{
					
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

				
				
				if (!filter_var($story->user->customer->image, FILTER_VALIDATE_URL)) {
					$story->user->customer->image = $story->user->customer->image
							? url(Storage::url('profile_image/' . $story->user->customer->image))
							: null;
				}
			
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Story detail is ready.', 'storyDetail'=>$story]; 
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
