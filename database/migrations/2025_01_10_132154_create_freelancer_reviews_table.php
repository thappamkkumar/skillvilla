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
        Schema::create('freelancer_reviews', function (Blueprint $table) {
            $table->id();
            // Foreign key for freelancer (user who worked on the job)
            $table->unsignedBigInteger('user_id'); // Freelancer ID
            // Foreign key for hirer (user who posted the job)
            $table->unsignedBigInteger('hirer_id'); // Hirer ID 
            $table->text('review');
            $table->integer('rating'); // Rating out of 5
            $table->timestamps();

            // Foreign keys with explicit deletion behavior
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Freelancer ID
            $table->foreign('hirer_id')->references('id')->on('users')->onDelete('cascade'); // Hirer ID
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelancer_reviews');
    }
};
