<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Community;
use App\Models\CommunityMember;

class CommunityMemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
		 

    public function run(): void
    {
			 $communities = Community::all();
        foreach ($communities as $community) {
            // Use the factory to create a community member for the creator
            CommunityMember::factory()->create([
                'community_id' => $community->id,
                'user_id' => $community->created_by,  // Set the creator as the user
                'role' => 'admin',  // Set the role as admin
                'can_share_content' => true,  // Allow content sharing
            ]);
        }
    }
}
