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
        Schema::create('companies', function (Blueprint $table) {
            $table->id();
						$table->unsignedBigInteger('user_id');
            $table->string('name');
            $table->string('logo')->nullable();
            $table->string('website')->comment('url')->nullable();
            $table->string('industry');
            $table->text('description')->nullable();
            $table->string('address');
            $table->string('email');
            $table->string('phone');
            $table->year('established_year');
            $table->timestamps();
						$table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('companies');
    }
};
