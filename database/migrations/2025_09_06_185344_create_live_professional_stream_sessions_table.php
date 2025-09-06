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
        Schema::create('live_professional_stream_sessions', function (Blueprint $table) {
            $table->id();
						
						$table->unsignedBigInteger('live_professional_stream_id');
						$table->foreign('live_professional_stream_id', 'fk_lpsession_stream')
									->references('id')->on('live_professional_streams')
									->onDelete('cascade');
					
					
            $table->string('title');
            $table->text('description')->nullable();

            $table->boolean('is_recording')->default(false);
            $table->enum('recording_type', ['cloud', 'local'])->nullable();
            $table->string('recording_url')->nullable();

            $table->enum('status', ['live', 'ended'])->nullable();

            $table->timestamp('started_at')->nullable();
            $table->timestamp('ended_at')->nullable();
            $table->timestamp('scheduled_at')->nullable();

            $table->unsignedInteger('total_viewers')->default(0);

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
        Schema::dropIfExists('live_professional_stream_sessions');
    }
};
