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
        'lefted_at',
        'is_suspended',
        'can_live',
        'can_message',
        'is_sharing',
    ];
		
		protected function casts(): array
		{
				return [   
						'can_message' => 'boolean',
						'is_suspended' => 'boolean', 
						'is_sharing' => 'boolean', 
						'can_live' => 'boolean', 
					];
		}
		
		
		 public function quickStream()
    {
        return $this->belongsTo(LiveQuickStream::class, 'live_quick_stream_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }
		
}
