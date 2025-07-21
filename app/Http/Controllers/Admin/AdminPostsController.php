<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Post;
use JWTAuth;
use Exception;
class AdminPostsController extends Controller
{
    //
		function getPostList()
		{
			try
			{ 
			
				$postList = Post::
				select('id', 'attachment',   'created_at', 'user_id')
				->with(['user:id,userID'])
				->withCount(['likes', 'comments'])
				->orderBy('id', 'desc')->cursorPaginate(25);
				
				// Convert file paths to full URLs
        foreach ($postList as $post) {
					 
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
 
 
				return response()->json([
            'status' => true,
            'message' => 'Post list fetched successfully.',
            'postList' => $postList,
             
        ]);
			}
			catch(Exception $e)
			{
				
				//$data = ['status' => false,'message'=> 'Oops! Something went wrong.'];
				$data = ['status' => false,'message'=> $e->getMessage()];
				return response()->json($data);
			}
			
		}
}
