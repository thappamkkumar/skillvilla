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
        Schema::create('live_professional_stream_session_viewers', function (Blueprint $table) {
            $table->id();
						
						$table->unsignedBigInteger('live_professional_stream_session_id');
						$table->foreign('live_professional_stream_session_id', 'fk_lpsviewer_session')
									->references('id')->on('live_professional_stream_sessions')
									->onDelete('cascade');

						$table->unsignedBigInteger('viewer_id');
						$table->foreign('viewer_id', 'fk_lpsviewer_user')
									->references('id')->on('users')
									->onDelete('cascade');

            $table->timestamp('joined_at')->nullable();
            $table->timestamp('left_at')->nullable();

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
        Schema::dropIfExists('live_professional_stream_session_viewers');
    }
};
