<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveStreamMessages extends Model
{
    use HasFactory;
		protected $table = 'live_stream_messages';
		
		protected $fillable = [
		'message',
		'sender_id'	,
		'live_stream_id'	,
		];
		
		public function liveStream()
    {
        return $this->belongsTo(LiveStream::class, 'live_stream_id');
    }
		
		//realtion with sender user
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
