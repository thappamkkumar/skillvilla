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
        Schema::create('freelance_saves', function (Blueprint $table) {
            $table->id();
						$table->foreignId('user_id')->constrained()->onDelete('cascade'); // Reference to the user who saved the job
            $table->foreignId('freelance_id')->constrained()->onDelete('cascade'); // Reference to the saved freelance job
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelance_saves');
    }
};
