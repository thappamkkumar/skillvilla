<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveProfessionalStreamSessionViewer extends Model
{
    use HasFactory;
		
		protected $table = 'live_professional_stream_session_viewers';
		
		 protected $fillable = [
        'live_professional_stream_session_id',
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
		
		public function session()
    {
        return $this->belongsTo(LiveProfessionalStreamSession::class, 'live_professional_stream_session_id');
    }

    public function viewer()
    {
        return $this->belongsTo(User::class, 'viewer_id');
    }
		
}
