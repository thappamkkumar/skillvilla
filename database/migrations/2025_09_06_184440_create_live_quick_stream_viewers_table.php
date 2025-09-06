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
        Schema::create('live_quick_stream_viewers', function (Blueprint $table) {
            $table->id();
						
						// foreign keys 
						$table->unsignedBigInteger('live_quick_stream_id');
						$table->foreign('live_quick_stream_id', 'fk_lqviewer_stream')
									->references('id')->on('live_quick_streams')
									->onDelete('cascade');

						$table->unsignedBigInteger('viewer_id');
						$table->foreign('viewer_id', 'fk_lqviewer_user')
									->references('id')->on('users')
									->onDelete('cascade');
						
						
						
						
            // activity timestamps
            $table->timestamp('joined_at')->nullable();
            $table->timestamp('lefted_at')->nullable();
            
            // viewer state and permissions
            $table->boolean('is_suspended')->default(false);
            $table->boolean('can_live')->default(false);
            $table->boolean('can_message')->default(true);
            $table->boolean('is_sharing')->default(false);
            
						
						
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_quick_stream_viewers');
    }
};
