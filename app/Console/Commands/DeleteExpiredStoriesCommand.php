<?php

namespace App\Console\Commands;

use Illuminate\Console\Scheduling\Schedule;
use Illuminate\Console\Command;
use App\Jobs\DeleteExpiredStories;

class DeleteExpiredStoriesCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:delete-expired-stories-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        //
				 $this->info('Dispatching DeleteExpiredStories job...');
        DeleteExpiredStories::dispatch();
        $this->info('Expired story deletion job dispatched.');
    }
		public function schedule(Schedule $schedule): void
    {
        // Run the command every hour
        $schedule->command(static::class)->hourly();
    }
}
