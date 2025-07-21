<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider; 
use FFMpeg\FFMpeg;
use FFMpeg\FFProbe;
class FFmpegServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
				 $this->app->singleton('ffmpeg', function ($app) {
            return FFMpeg::create([
                'ffmpeg.binaries'  => env('FFMPEG_BINARY', 'ffmpeg'),
                'ffprobe.binaries' => env('FFPROBE_BINARY', 'ffprobe'),
            ]);
        });
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        //
    }
}
