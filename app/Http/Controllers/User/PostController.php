<?php

namespace App\Http\Controllers\User;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
 

//use FFMpeg\Coordinate\TimeCode;// For video processing
 
use Illuminate\Support\Facades\Validator;
use App\Events\PostLikeEvent;
//use App\Events\PostSaveEvent;
use App\Events\PostCommentEvent;
use App\Events\PostCommentCountEvent;
use App\Events\PostDeleteEvent;
use App\Events\AddNewPost;

use App\Models\PostLike; 
use App\Models\PostSave; 
use App\Models\PostComment; 
use App\Models\User; 
use App\Models\Post; 
use JWTAuth;
use Exception;


use App\Traits\GenerateThumbnailTrait;

class PostController extends Controller
{
	//trait for generating thumnail
	use GenerateThumbnailTrait;
	
	//function for get list of posts of followed user for home page
	function getInterestedPostList(Request $request){
			try
			{
				// Retrieve the authenticated user from the JWT token
        $user = JWTAuth::parseToken()->authenticate();

				// Retrieve the IDs of the users whom the authenticated user is following
        $followingIds = $user->following()->pluck('following_id');
				
				$userInterests =  $user->customer->interest ;  // Get user's interests (stored as JSON)
				
				 
				$postsQuery = Post::select('id', 'attachment',   'created_at', 'user_id')
				 
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
				->orderBy('id', 'desc') 
				->where('user_id', '!=', $user->id) // Ensure user does not see their own posts
				->where(function ($query) use ($userInterests, $followingIds) {
					if (!empty($userInterests)) {
						foreach ($userInterests as $interest) {
							$query->orWhereJsonContains('category', $interest);
						}
					}

					if (!$followingIds->isEmpty()) {
						$query->orWhereIn('user_id', $followingIds);
					}
				});

				$postList = $postsQuery->cursorPaginate(10); 
				
				// Convert file paths to full URLs
        foreach ($postList as $post) {
					
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
	
	
	//function for get list of posts of particuller user or logged user
	function getUserPostList(Request $request){
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
         
				$postList = Post::select('id', 'attachment',   'created_at', 'user_id')
				->where('user_id', $user_id)
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
				->orderBy('id', 'desc')->cursorPaginate(10); 
				
        // Convert file paths to full URLs
        foreach ($postList as $post) {
					
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
	
	
	//function for fetch and return post detail
	function getPostDetail(Request $request){
		try{
				// Retrieve the authenticated user from the JWT token
				$user = JWTAuth::parseToken()->authenticate();

				$postDetail = Post::select(
				'id',
				'user_id',
        'attachment',
        'description', 
        'category',
				'created_at',
				)
				 ->with([
							'user:id,userID,name',
							'user.customer:id,user_id,image',
								
							'tags:id,userID',
					])
					->withCount('likes') 
					->withExists(['likes as has_liked' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
					}])
					->withExists(['saves as has_saved' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
					}])
					->withCount('comments')
					->findOrFail($request->postId); 
				 
				 
					//Convert  user profile  to full URLs 
					if ($postDetail->user->customer != null && !filter_var($postDetail->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 
						$postDetail->user->customer->image = $postDetail->user->customer->image
						? url(Storage::url('profile_image/' . $postDetail->user->customer->image))  
						: null; 
					}	

					//Convert   post attachment  to full URLs 
					$updatedAttachments = [];
					for($i=0; $i < count($postDetail->attachment); $i++)
					{
						if(empty($postDetail->attachment[$i])) 
						{
							$postDetail->attachment[$i] = null;
							continue;  
						}
						
						$fileExtension = pathinfo($postDetail->attachment[$i], PATHINFO_EXTENSION) ?? null;

						if($fileExtension == null)
						{
							continue;
						}
						
						// Determine folder name based on file type
						$folderName = ($fileExtension == 'mp4') ? 'post_video' : 'post_image';
						
						$attachmentFileUrl =  url(Storage::url($folderName .'/' . $postDetail->attachment[$i]));
						
						// Store updated attachment info
						$updatedAttachments[] = [
								'file_type' => $fileExtension,
								'file_url' => $attachmentFileUrl,
						];
						
					}
					
					// Reassign the modified array back to the model
					$postDetail->attachment = $updatedAttachments;



				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Post Detail is ready.', 'postDetail'=>$postDetail]; 
				return response()->json($data);
			}
		catch(Exception $e){
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}

	//function for like and unlike the post
	function likePost(Request $request) 
	{
		try
		{
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			$likeData = [ 
					'user_id'=>$user->id,
					'post_id'=>$request->post_id, 
				];
			$like = PostLike::where('user_id', $user->id)->where('post_id',$request->post_id)->first();
			if($like)
			{
				$like->delete();
				$likeData['status'] = false;
			}
			else
			{
				$createLike = PostLike::create(['user_id'=>$user->id, 'post_id'=>$request->post_id]);
				$likeData['status'] = true;
			} 
			$likesCount = PostLike::where('post_id', $request->post_id)->count();
			$likeData['likes_count'] = $likesCount;
			 
			//Dispatching event
			PostLikeEvent::dispatch( 
					 $likeData 
				 ); 
				 
			// Return the posts as a JSON response
			$data = ['status' => true,'message'=> 'Like operation is succefull.', 'datalike'=>$likeData]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
	}



 //function for fetch list of comment on post
	function getPostComment(Request $request)
	{
			try
			{
				// Retrieve the authenticated user from the JWT token 
				 $postId = $request->post_id; 
				
				 

				 
				$comments = PostComment::where('post_id', $request->post_id)
				->with([ 'user', 'user.customer:id,user_id,image',])
				->orderBy('id', 'desc')->cursorPaginate(10);
				
				//Convert  user profile  to full URLs 
				foreach($comments as $comment)
				{
					if($comment->user->customer == null)
					{
						continue;
					}
					 
					if (!filter_var($comment->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 
						$comment->user->customer->image = $comment->user->customer->image
						? url(Storage::url('profile_image/' . $comment->user->customer->image))  
						: null; 
					}	
				}
				 
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> 'Comment List is ready.', 'commentList'=>$comments ]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}
	
	
	
	//function for uplaod new comment on post
	function uploadPostComment(Request $request)
	{
			try
			{
				// Retrieve the authenticated user from the JWT token
        $user = JWTAuth::parseToken()->authenticate(); 
				
				//upload new Comment 
				$comment = PostComment::create([ 'post_id'=>$request->post_id, 'user_id'=>$user->id, 'comment' => $request->comment]);
				$comment->load([
					'user:id,userID,name', 
					'user.customer:id,user_id,image'
				]);
				$comment['new'] = true; 
				
				//converting user profile name into url
				if ($comment->user->customer != null && !filter_var($comment->user->customer->image, FILTER_VALIDATE_URL)) 
					{ 
						$comment->user->customer->image = $comment->user->customer->image
						? url(Storage::url('profile_image/' . $comment->user->customer->image))  
						: null; 
					}	
				
				//Dispatching event
				 PostCommentEvent::dispatch([
					'addedComment'=> $comment, 
				]);
				
				
				$totalComments = PostComment::where('post_id',$request->post_id)->count();
				
				PostCommentCountEvent::dispatch([
					'postId' => $request->post_id,
					'user_id' => $user->id,
					'comments_count'=>$totalComments,
				]);
				
				// Return the posts as a JSON response
				$data = ['status' => true,'message'=> "Comment is uploaded successfully", 'newComment'=>$comment, 'commentCount'=>[ 
					'postId' => $request->post_id,
					'user_id' => $user->id,
					'comments_count'=>$totalComments,
				]]; 
				return response()->json($data);
			}
			catch(Exception $e)
			{
				$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				//$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
	}



	//function for save the post or remove post from save
	function savePost(Request $request)
	{
		try
		{
			$savePostData = null;
			$user = JWTAuth::parseToken()->authenticate();
			$save = PostSave::where('user_id', $user->id)->where('post_id',$request->post_id)->first();
			if($save)
			{
				$save->delete();
				$savePostData = [ 
					'user_id'=>$user->id,
					'post_id'=>$request->post_id,
					'status' => 'unSaved'
				];
			}
			else
			{
				$createSave = PostSave::create(['user_id'=>$user->id, 'post_id'=>$request->post_id]);
				$savePostData = [ 
					'user_id'=>$createSave->user_id,
					'post_id'=>$createSave->post_id,
					'status' => 'saved'
				];
			} 
			
			//Dispatching event
			/*PostSaveEvent::dispatch( 
					 $savePostData 
				 ); */
				 
			// Return the response as a JSON response
			$data = ['status' => true,'message'=> 'save operation is successfull.', 'savePostData'=>$savePostData];  
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status' => false,'message'=> $e->getMessage()];
			return response()->json($data);
		}
		
	}
	
	
	//function for delete Post
	function deletePost(Request $request)
	{
		try
		{
			// Retrieve the authenticated user from the JWT token
        $user = JWTAuth::parseToken()->authenticate(); 
				
        // Find the post by ID
        $post = Post::findOrFail($request->postId);
        
        // Get the attachments array
        $attachments = $post->attachment;  
        
        // Define the base paths for different types of files
        $imagePath = 'post_image/';
        $videoPath = 'post_video/';
        $thumbnailPath ='post_video_thumbnail/';
        
        // Loop through the attachments and delete them
        foreach ($attachments as $filename) {
            $fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
            $fileNameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);
            
            // Check if the file is an image
            if (in_array($fileExtension, ['jpg', 'jpeg', 'png'])) {
                 
								$filePath = $imagePath . $filename;
								if (Storage::disk('public')->exists($filePath)) {  
											Storage::disk('public')->delete($filePath);
								}
            }

            // Check if the file is a video
            if ($fileExtension === 'mp4') {
                $filePath = $videoPath . $filename;
 								if (Storage::disk('public')->exists($filePath)) {  
											Storage::disk('public')->delete($filePath);
								}
								
                // Delete the corresponding thumbnail
                $thumbnailFilePath = $thumbnailPath . $fileNameWithoutExt . '.png'; 
 								if (Storage::disk('public')->exists($thumbnailFilePath)) {  
											Storage::disk('public')->delete($thumbnailFilePath);
								}
								
            }
        }
        
        // Delete the post from the database
        $post->delete();
         
				//Dispatching event
				PostDeleteEvent::dispatch( 
					[  
						'post_id'=>$request->postId, 
						'user_id'=>$user->id, 
					]
				); 

        // Return the response as a JSON response
        $data = ['status' => true, 'message' => 'Post is deleted successfully.'];  
        return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status'=>false, 'message'=>$e->getMessage()];
			return response()->json($data);
		}
		
	}

	//function for get tagged post-
	function getTaggedPost(Request $request)
	{
		try
		{ 
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
				 
			
			
        // Retrieve posts from users whom the authenticated user is following
         
				//$postList = Post::select('id', 'attachment',   'created_at', 'user_id') 
			$postList = Post::whereHas('tags', function ($query) use ($user) {
					$query->where('post_tags.user_id', $user->id);  
					})
					->select('id', 'attachment', 'created_at', 'user_id')
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
					->orderBy('id', 'desc')->cursorPaginate(10); 
			
				// Convert file paths to full URLs
        foreach ($postList as $post) {
					
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
         
			// Return the response as a JSON response
			$data = ['status' => true,'message'=> 'Post List is ready.', 'postList'=>$postList]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status'=>false, 'message'=>$e->getMessage()];
			return response()->json($data);
		}
	}
	
	//function for get saved post-
	function getSavedPost(Request $request)
	{
		try
		{ 
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
				 
			
			
        // Retrieve posts from users whom the authenticated user is following
         
				 
				$postList = Post::whereHas('saves', function ($query) use ($user) {
					$query->where('post_saves.user_id', $user->id);  
					})
					 ->select([
								'posts.id',
								'posts.attachment',
								'posts.created_at',
								'posts.user_id',
								\DB::raw('(SELECT MAX(post_saves.created_at) FROM post_saves WHERE post_saves.post_id = posts.id AND post_saves.user_id = ' . $user->id . ') as latest_save_time')
						])
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
					->orderBy('latest_save_time', 'desc')
					->cursorPaginate(10); 
       
			 // Convert file paths to full URLs
        foreach ($postList as $post) {
					
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

			// Return the response as a JSON response
			$data = ['status' => true,'message'=> 'Post List is ready.', 'postList'=>$postList]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			$data = ['status'=>false, 'message'=>$e->getMessage()];
			return response()->json($data);
		}
	}

	/*function getUserProject(Request $request)
	{
		try
		{ 
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			
			$projectList = $user->projects() 
				->select('projects.id', 'projects.name', 'projects.created_at' ) 
				->orderBy('id', 'desc')->cursorPaginate(20); 
       

			// Return the response as a JSON response
			$data = ['status' => true,'message'=> 'Project list is ready.', 'projectList'=>$projectList]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status'=>false, 'message'=>$e->getMessage()];
			return response()->json($data);
		}
	}*/

	// function to add new post
	function uploadNewPost(Request$request)
	{
		$messages = [
				'attachment.required' => 'The attachment is required.', 
				'category.required' => 'The attachment is required.', 
		];
		// Validate the request  
		$validator = Validator::make($request->all(), [
				'attachment' => 'required',
				'category' => 'required',
				'tags' => 'nullable', 
		], $messages);
		if ($validator->fails()) {
				// Return validation errors within the try block
				return response()->json(['status' => false, 'message' => $validator->errors()->first()]);
			 
		}
		try
		{ 
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			
			$files =$request->attachment;
		 
			// Create a new post
			$post = new Post();
			$post->user_id = $user->id;
			$post->attachment = []; 
			$post->category =  $request->input('category', []);; 
			$post->description = $request->description; 
			$post->save();
			
			$attachmentFile = [];
			$fileName = 'post_'.$post->id.'_fileNo';
			$fileCount = 1;
			foreach ($files as $file) 
			{
				$extension = $file->extension();
				if (in_array($extension, ['jpg', 'jpeg', 'png'])) 
				{
					// Handle image upload 
					$imageFileName = $fileName.'_'.$fileCount.'_image.'.$extension;
					$file->storeAs('post_image', $imageFileName, 'public');
					
					$attachmentFile[] = $imageFileName;
					$fileCount++;
				} 
				elseif ($extension === 'mp4')
				{
					// Handle video upload
					$videoFileName = $fileName.'_'.$fileCount.'_video.'.$extension;
					$file->storeAs('post_video', $videoFileName, 'public'); 
					$attachmentFile[] = $videoFileName;
				  
					// Generate thumbnail for video
						$videoPath = storage_path('app/public/post_video/' . $videoFileName);
						$thumbnailPath = storage_path('app/public/post_video_thumbnail/'.$fileName.'_'.$fileCount.'_video.png');
					
					$this->generateVideoThumbnail($videoPath, $thumbnailPath);
					 
					$fileCount++;
				}
			}
			
			$post->attachment = $attachmentFile;
			$post->save();
			
			$tagsArray =$request->tags; 
			// Attach tags if provided
			 if ($tagsArray != null && count($tagsArray)>0) 
			{
					$tag = array_map('intval', $tagsArray); // Ensure all tags are integers
					$post->tags()->attach($tag);
			}
			
			
			 // Load relationships and aggregates
			$post->load([
					'user:id,userID,name',
					'user.customer:id,user_id,image',
					  
			])
			->loadCount(['likes', 'comments'])
			->loadExists([
					'likes as has_liked' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
					},
					'saves as has_saved' => function ($query) use ($user) {
							$query->where('user_id', $user->id);
					}
			]);
			
			//converting file name into url
			//user profilr image
			if ($post->user->customer != null && !filter_var($post->user->customer->image, FILTER_VALIDATE_URL)) 
			{ 
				$post->user->customer->image = $post->user->customer->image
				? url(Storage::url('profile_image/' . $post->user->customer->image))  
				: null; 
			}	
			//post attachment
			$fileExtension = !empty($post->attachment) && isset($post->attachment[0])  && is_string($post->attachment[0]) 
						? pathinfo($post->attachment[0], PATHINFO_EXTENSION) 
						: null;
				 
			if($fileExtension == 'mp4')
			{ 
				$thumbnailFileName = pathinfo($post->attachment[0], PATHINFO_FILENAME) . '.png';
				$post->attachment = url(Storage::url('post_video_thumbnail/' . $thumbnailFileName));
				 										
			}
			else
			{
				if (!filter_var($post->attachment[0], FILTER_VALIDATE_URL)) 
				{ 
					$post->attachment = $post->attachment[0]
					? url(Storage::url('post_image/' . $post->attachment[0]))  
					: null; 
				}	
			}		
					
					
			
			//ready data for return
			$newPostData = $post->only(['id', 'attachment',   'created_at_human_readable', 'user_id']);
			$newPostData['user'] = $post->user;
			$newPostData['likes_count'] = $post->likes_count;
			$newPostData['has_liked'] = $post->has_liked;
			$newPostData['has_saved'] = $post->has_saved;
			 
			$newPostData['comments_count'] = $post->comments_count;
			
			//dispach event for real time updation
			AddNewPost::dispatch($newPostData);
				 
					
			 
			// Return the response as a JSON response
			$data = ['status' => true,'message'=>'Post is uploaded successfully', 'newPost'=>$newPostData ]; 
			return response()->json($data);
		}
		catch(Exception $e)
		{
			$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
			//$data = ['status'=>false, 'message'=>$e->getMessage()];
			return response()->json($data);
		}
	}
	
	  //function to get user users list for user search for tags or other operation
	function getUserListForPostTag(Request $request)
	{
		try
		{ 
			
			// Retrieve the authenticated user from the JWT token
			$user = JWTAuth::parseToken()->authenticate();
			
			// Retrieve the IDs of the users whom the authenticated user is following
		  $followingIds = $user->following()->pluck('following_id');
			
			$searchInput = $request->input('searchInput');
			
			
			$userListQuery = User::select('id', 'name', 'userID')
				->whereIn('id', $followingIds)
				->with([
					'customer:id,user_id,image', 
				]);
			
			if ($searchInput) {
				
				$userListQuery->where(function ($query) use ($searchInput) {
				$query-> where('userID', $searchInput)
								->orWhere('email', $searchInput) 										
								->orWhere('name', 'like', "%$searchInput%");	
				});
			 
			} 	
			$userList = $userListQuery->cursorPaginate(10); 
			
			// Convert file paths to full URLs
      foreach ($userList as $selectedUser) {
				if($selectedUser->customer != null && !filter_var($selectedUser->customer->image, FILTER_VALIDATE_URL)) 
				{ 
						$selectedUser->customer->image = $selectedUser->customer->image
						? url(Storage::url('profile_image/' . $selectedUser->customer->image))  
						: null; 
				}	
			}
			
			// Return the posts as a JSON response
			$data = ['status' => true,'message'=> 'User List is ready.', 'userList'=>$userList,  ]; 
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

					
						
			 