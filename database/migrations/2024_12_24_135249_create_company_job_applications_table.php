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
        Schema::create('company_job_applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->unsignedBigInteger('company_job_id');
            $table->unsignedBigInteger('test_attempt_id')->nullable();
            $table->string('resume');
            $table->string('self_introduction')->nullable();
						$table->string('status')->default('Submitted');;
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('company_job_id')->references('id')->on('company_jobs')->onDelete('cascade');
            $table->foreign('test_attempt_id')->references('id')->on('company_job_test_attempts')->onDelete('set null');
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('company_job_applications');
    }
};
