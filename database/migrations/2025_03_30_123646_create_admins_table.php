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
        Schema::create('admins', function (Blueprint $table) {
            $table->id();
						 
						$table->foreignId('user_id')->constrained()->onDelete('cascade'); 
            $table->string('mobile_number')->nullable();
            $table->string('city_village')->nullable();
            $table->string('state')->nullable();
            $table->string('country')->nullable();  
            $table->string('image')->nullable();
						$table->boolean('two_factor_enabled')->default(false); // Security setting
            
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admins');
    }
};
