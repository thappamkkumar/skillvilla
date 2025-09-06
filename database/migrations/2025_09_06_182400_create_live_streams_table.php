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
        Schema::create('live_streams', function (Blueprint $table) {
            $table->id();
						 
						$table->unsignedBigInteger('publisher_id');  
						$table->foreign('publisher_id', 'fk_lstream_user')
							->references('id')->on('users')
							->onDelete('cascade');
							
            $table->timestamps();
						
					 
						
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_streams');
    }
};
