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
        Schema::create('live_professional_streams', function (Blueprint $table) {
            $table->id(); 
						
            $table->unsignedBigInteger('live_stream_id');
						$table->foreign('live_stream_id', 'fk_lpstream_stream')
									->references('id')->on('live_streams')
									->onDelete('cascade');

						$table->unsignedBigInteger('category_id')->nullable();
						$table->foreign('category_id', 'fk_lpstream_cat')
									->references('id')->on('live_professional_stream_categories')
									->onDelete('set null');



            $table->string('title');
            $table->text('description')->nullable();
						
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('live_professional_streams');
    }
};
