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
        Schema::create('communities', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('description')->nullable();
						$table->string('image')->nullable();
            $table->enum('privacy', ['public', 'private'])->default('public');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->enum('content_share_access', ['everyone', 'selected'])->default('everyone');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('communities');
    }
};
