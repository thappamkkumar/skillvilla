<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveQuickStreamViewer extends Model
{
    use HasFactory;
		
		protected $table = 'live_quick_stream_viewers';
			
		protected $fillable = [
        'live_quick_stream_id',
        'viewer_id',
        'joined_at',
        'left_at',
        'is_suspended',
        'can_live',
        'can_message',
        'is_sharing',
    ];
		
		 public function quickStream()
    {
        return $this->belongsTo(LiveQuickStream::class, 'live_quick_stream_id');
    }

    public function viewer()
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }
		
}
