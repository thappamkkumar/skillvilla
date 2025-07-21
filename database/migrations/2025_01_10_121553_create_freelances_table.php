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
        Schema::create('freelances', function (Blueprint $table) {
						$table->id();
						$table->foreignId('user_id')->constrained()->onDelete('cascade'); // Ensures referential integrity
            $table->string('title');
            $table->text('description');
            $table->json('skill_required')->nullable(); // Stores JSON data
            $table->decimal('budget_min', 10, 2);
            $table->decimal('budget_max', 10, 2);
            $table->string('payment_type'); // String for payment type
            $table->date('deadline')->nullable();
            $table->string('experience_level');
            $table->string('duration');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelances');
    }
};
