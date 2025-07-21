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
        Schema::create('company_jobs', function (Blueprint $table) {
          $table->id();
						$table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('company_id');
            $table->string('title');
            $table->text('description');
            $table->string('salary')->nullable();
						$table->string('payment_type')->nullable();
            $table->string('job_location');
            $table->string('employment_type');
            $table->date('expires_at')->nullable();
            $table->json('skill_required')->nullable();
            $table->string('email');
            $table->string('phone');
            $table->boolean('work_from_home');
            $table->string('communication_language');
            $table->integer('time_limit')->default(1);
           
            $table->timestamps();
						
						$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('id')->on('companies')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_jobs');
    }
};
