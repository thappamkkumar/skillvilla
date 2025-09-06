<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveProfessionalStreamSession extends Model
{
    use HasFactory;
		
		protected $table = 'live_professional_stream_sessions';
		
		protected $fillable = [
        'live_professional_stream_id',
        'title',
        'description',
        'is_recording',
        'recording_type',
        'recording_url',
        'status',
        'started_at',
        'ended_at',
        'scheduled_at',
        'total_viewers',
        'on_hold',
        'can_chat',
        'speaker_off',
        'camera_off',
        'mic_off',
    ];
		
		public function professionalStream()
    {
        return $this->belongsTo(LiveProfessionalStream::class, 'live_professional_stream_id');
    }

    public function viewers()
    {
        return $this->hasMany(LiveProfessionalStreamSessionViewer::class, 'live_professional_stream_session_id');
    }
}
