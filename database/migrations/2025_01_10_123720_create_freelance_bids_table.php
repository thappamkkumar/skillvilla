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
        Schema::create('freelance_bids', function (Blueprint $table) {
            $table->id();
						$table->foreignId('freelance_id')->constrained()->onDelete('cascade'); // Reference to the freelance job
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Freelancer placing the bid
            $table->text('cover_letter'); // Cover letter for the bid
            $table->decimal('bid_amount', 10, 2); // Amount for the bid
            $table->string('payment_type'); // Payment type (e.g., hourly, fixed)
            $table->string('delivery_time'); // Estimated delivery time in days
            $table->string('status')->default('pending'); // Status of the bid
            //$table->json('previous_project')->nullable(); // JSON array of previous projects (e.g., links, descriptions)
           
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('freelance_bids');
    }
};
