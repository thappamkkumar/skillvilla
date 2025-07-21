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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
						$table->foreignId('chat_list_id')->constrained('chat_lists')->onDelete('cascade');
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade');
            $table->text('message')->nullable();
						$table->string('attachment')->nullable();
						
						$table->unsignedBigInteger('post_id')->nullable();
						$table->unsignedBigInteger('workfolio_id')->nullable();
						$table->unsignedBigInteger('problem_id')->nullable();
						$table->unsignedBigInteger('company_job_id')->nullable();
						$table->unsignedBigInteger('freelance_id')->nullable();
						$table->unsignedBigInteger('stories_id')->nullable();
						$table->unsignedBigInteger('community_id')->nullable();
						$table->unsignedBigInteger('user_id')->nullable(); 
						
						$table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
						$table->foreign('workfolio_id')->references('id')->on('workfolios')->onDelete('cascade');
						$table->foreign('problem_id')->references('id')->on('problems')->onDelete('cascade');
						$table->foreign('company_job_id')->references('id')->on('company_jobs')->onDelete('cascade');
						$table->foreign('freelance_id')->references('id')->on('freelances')->onDelete('cascade');
						$table->foreign('stories_id')->references('id')->on('stories')->onDelete('cascade');
						$table->foreign('community_id')->references('id')->on('communities')->onDelete('cascade');
						$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
						 
						
						 
						
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
