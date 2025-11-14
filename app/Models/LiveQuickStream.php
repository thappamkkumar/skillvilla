<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;
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
		
		protected function casts(): array
		{
				return [  
						'on_hold' => 'boolean',
						'can_chat' => 'boolean',
						'is_recording' => 'boolean',
						'speaker_off' => 'boolean',
						'camera_off' => 'boolean',
						'mic_off' => 'boolean',
					];
		}
		
		protected $appends = ['started_at_human_readable']; 
		
		
		public function getStartedAtHumanReadableAttribute()
    { 
        return Carbon::parse($this->attributes['started_at'])->diffForHumans();
    }
		
		public function liveStream()
    {
        return $this->belongsTo(LiveStream::class, 'live_stream_id');
    }

    public function viewers()
    {
        return $this->hasMany(LiveQuickStreamViewer::class, 'live_quick_stream_id');
    }
		
		
}
