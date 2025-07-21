<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Community;
use App\Models\User;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Community>
 */
class CommunityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
		 protected $model = Community::class;

    public function definition(): array
    {
         return [
            'name' => $this->faker->word(),
            'description' => $this->faker->sentence(),
            'image' => 'bg10.png', // Example static image
            'privacy' => $this->faker->randomElement(['public', 'private']),
            'created_by' => User::inRandomOrder()->first()?->id ?? User::factory(),
            'content_share_access' => $this->faker->randomElement(['everyone', 'selected']),
        ];
    }
}
