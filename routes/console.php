<?php

//use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
//use App\Jobs\DeleteExpiredStories;
use Illuminate\Support\Facades\Schedule;
use App\Console\Commands\DeleteExpiredStoriesCommand;


/*
Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();
*/

 /*Artisan::command('stories:delete-expired', function () {
    DeleteExpiredStories::dispatch();
    $this->info('Expired story deletion job dispatched.');
})->hourly(); */

 Schedule::command(DeleteExpiredStoriesCommand::class)->hourly();