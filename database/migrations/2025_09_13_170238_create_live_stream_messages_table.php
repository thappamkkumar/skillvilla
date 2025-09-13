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
        Schema::create('live_stream_messages', function (Blueprint $table) {
            $table->id();
						
						// foreign keys 
						$table->unsignedBigInteger('live_stream_id');
						$table->foreign('live_stream_id', 'fk_lqstream_message')->references('id')->on('live_streams')->onDelete('cascade');
						
						$table->unsignedBigInteger('sender_id');
						$table->foreign('sender_id', 'fk_lqmessage_sender')->references('id')->on('users')->onDelete('cascade');
						
						
						
						$table->text('message')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_stream_messages');
    }
};
