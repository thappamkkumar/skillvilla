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
        Schema::create('problem_solutions', function (Blueprint $table) {
             $table->id();  // Primary key 'id'
            $table->foreignId('problem_id')->constrained()->onDelete('cascade');  // Foreign key to problems table
            $table->foreignId('user_id')->constrained()->onDelete('cascade');  // Foreign key to users table
            $table->text('solution');  // Solution text field
            $table->string('attachment')->nullable();  // Optional attachment (file path)
            $table->timestamps();  // Created_at and updated_at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problem_solutions');
    }
};
