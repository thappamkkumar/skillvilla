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
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
						$table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->string('mobile_number')->nullable();
            $table->string('city_village')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();
            $table->json('interest')->nullable();
            $table->text('about')->nullable();
            $table->string('image')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('candidates');
    }
};
