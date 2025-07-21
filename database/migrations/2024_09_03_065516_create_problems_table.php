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
        Schema::create('problems', function (Blueprint $table) {
            $table->id(); // auto-incrementing primary key
						$table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to users table
            $table->string('title'); // Problem title
            $table->text('description'); // Problem description
            $table->string('attachment')->nullable(); // Attachment file (nullable)
            $table->string('url')->nullable(); // External URL (nullable)
           
            $table->timestamps(); // created_at and updated_at timestamps
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('problems');
    }
};
