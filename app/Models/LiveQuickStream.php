<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveQuickStream extends Model
{
    use HasFactory;
		protected $table = 'live_quick_streams';
		
		protected $fillable = [
		'live_stream_id',  
		'is_recording',  
		'started_at',  
		'ended_at',  
		'on_hold',  
		'can_chat',     
		'speaker_off',  
		'camera_off',  
		'mic_off',    
		];
		
		public function liveStream()
    {
        return $this->belongsTo(LiveStream::class, 'live_stream_id');
    }

    public function viewers()
    {
        return $this->hasMany(LiveQuickStreamViewer::class, 'live_quick_stream_id');
    }
		
		
}
