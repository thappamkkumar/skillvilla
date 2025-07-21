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
        Schema::create('workfolio_reviews', function (Blueprint $table) {
            $table->id(); 
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // User who leaves the review
            $table->foreignId('workfolio_id')->constrained()->onDelete('cascade'); // Reviewed workfolio
            $table->tinyInteger('rating')->unsigned()->comment('Rating out of 5'); // Rating (1-5)
            $table->text('comment')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('workfolio_reviews');
    }
};
