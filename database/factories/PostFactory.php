<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Post>
 */
class PostFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
         return [
            'user_id' => 1, // Assuming user with ID 1
            'attachment' => ['media1.jpg', 'flower.mp4'], // Example attachment
            'description' => $this->faker->paragraph,
            'tags' => ['tag1', 'tag2', 'tag3'],
            'project_id' => null, // Assuming product IDs range from 1 to 10
        ];
    }
}
