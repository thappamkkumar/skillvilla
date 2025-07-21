<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use App\Models\Stories;

class DeleteExpiredStories implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        //fetch expired stories and delete it
				$expiredStories = Stories::where('expires_at', '<', now())->get();
        
				foreach ($expiredStories as $story) {
            // Delete story file and thumbnail if it's a video
            if (!empty($story->story_file))
						{
                $filename = $story->story_file;
                $fileExtension = pathinfo($filename, PATHINFO_EXTENSION);
                $fileNameWithoutExt = pathinfo($filename, PATHINFO_FILENAME);

                if ($fileExtension === 'mp4') 
								{
                    $thumbnailFilePath = public_path('stories_thumbnail/' . $fileNameWithoutExt . '.png');
                    if (file_exists($thumbnailFilePath)) 
										{
                        unlink($thumbnailFilePath);
                    }
                }

                $filePath = public_path('stories_file/' . $filename);
                if (file_exists($filePath)) 
								{
                    unlink($filePath);
                }
            }

            // Delete the story (comments will be deleted automatically due to cascade)
            $story->delete();
        }
     
    }
}
