<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

use App\Models\CommunityMember;
use App\Models\Community;
use App\Models\User;
/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\CommunityMember>
 */
class CommunityMemberFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
		   protected $model = CommunityMember::class;
    public function definition(): array
    {
       return [
            'community_id' => Community::factory(),  // This will create a community automatically
            'user_id' => User::factory(),  // Random user ID from users table
            'role' => 'member',  // Default role is member
            'can_share_content' => true, // Default to true
        ];
    }
}
