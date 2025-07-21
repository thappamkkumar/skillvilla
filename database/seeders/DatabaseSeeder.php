<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Post;
use App\Models\PostLike;
use App\Models\PostComment;
use App\Models\Project;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();
				User::factory()->count(10)->create();
				Post::factory(5)->create();
				PostLike::factory()->count(3)->create();
				PostComment::factory()->count(3)->create();
				Project::factory()->count(3)->create();
				
				 
    }
}
