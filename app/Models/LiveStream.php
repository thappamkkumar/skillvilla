<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveStream extends Model
{
    use HasFactory;
		protected $table = 'live_streams';
		
		protected $fillable = [
		'publisher_id',  
		];
		
		
		public function publisher()
    {
        return $this->belongsTo(User::class, 'publisher_id');
    }

    public function quickStreams()
    {
        return $this->hasMany(LiveQuickStream::class, 'live_stream_id');
    }

    public function professionalStreams()
    {
        return $this->hasMany(LiveProfessionalStream::class, 'live_stream_id');
    }
		
		public function messages()
    {
        return $this->hasMany(LiveStreamMessages::class, 'live_stream_id');
    }
		
		
}
