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
        Schema::create('hirer_reviews', function (Blueprint $table) {
           $table->id();
            $table->unsignedBigInteger('user_id'); // Hirer ID (user who posted the job)
            $table->unsignedBigInteger('freelancer_id'); // Freelancer ID (user who worked on the job)
            $table->text('review');
            $table->integer('rating'); // Rating out of 5
            $table->timestamps();

            // Foreign keys with explicit deletion behavior
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Hirer ID
            $table->foreign('freelancer_id')->references('id')->on('users')->onDelete('cascade'); // Freelancer ID
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('hirer_reviews');
    }
};
