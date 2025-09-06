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
        Schema::create('live_quick_streams', function (Blueprint $table) {
            $table->id();
						
						// foreign keys 
						$table->unsignedBigInteger('live_stream_id');
						$table->foreign('live_stream_id', 'fk_lqstream_stream')->references('id')->on('live_streams')->onDelete('cascade');
						
            $table->boolean('is_recording')->default(false);
            
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            
            $table->boolean('on_hold')->default(false);
            $table->boolean('can_chat')->default(true); 
            
            $table->boolean('speaker_off')->default(false);
            $table->boolean('camera_off')->default(false);
            $table->boolean('mic_off')->default(false);
            $table->timestamps();
						
					  
						
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_quick_streams');
    }
};
