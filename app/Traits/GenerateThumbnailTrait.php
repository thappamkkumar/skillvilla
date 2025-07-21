<?php

namespace App\Traits;

use FFMpeg\Coordinate\TimeCode;// For video processing
trait GenerateThumbnailTrait
{
     /**
     * Generate a thumbnail from a video file.
     *
     * @param string $videoPath Full path to the video file
     * @param string $thumbnailPath Full path where the thumbnail should be saved
     * @return void
     */
		private function generateVideoThumbnail($videoPath, $thumbnailPath)
		{
				//$thumbnailPath = public_path('video_thumbnail/'.$filename.'png');
			try 
			{
				 // Resolve FFmpeg instance from Laravel's container
            $ffmpeg = app('ffmpeg');
						
					// Open the video file
            $video = $ffmpeg->open($videoPath);
 
					// Capture a frame at 1 second
					$frame = $video->frame(TimeCode::fromSeconds(1));
					
					 // Save the frame as a thumbnail
					$frame->save($thumbnailPath);
					
			 } catch (\Exception $e) {
            //Log::error("FFmpeg Thumbnail Generation Failed: " . $e->getMessage());
			 }
			 
		}
		
}
