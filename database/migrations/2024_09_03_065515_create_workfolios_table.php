<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('workfolios', function (Blueprint $table) {
          $table->id();
					$table->foreignId('user_id')->constrained()->onDelete('cascade');
					$table->string('title');
					$table->text('description')->nullable();
					$table->json('tags')->nullable(); // Array, 'code', 'art', 'painting'
					$table->json('images')->nullable(); // Array of image paths
					$table->string('video')->nullable(); // Single video file path
					$table->string('other')->nullable();  
					$table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workfolios');
    }
};
