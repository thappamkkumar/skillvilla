<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;

class LiveStream extends Model
{
    use HasFactory;
		protected $table = 'live_streams';
		
		protected $fillable = [
		'publisher_id',  
		];
		
		
		protected $appends = ['created_at_human_readable']; 
		
		
		public function getCreatedAtHumanReadableAttribute()
    { 
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }
		
		public function publisher()
    {
        return $this->belongsTo(User::class, 'publisher_id');
    }

    public function quickStream()
    {
        return $this->hasOne(LiveQuickStream::class, 'live_stream_id');
    }

    public function professionalStream()
    {
        return $this->hasOne(LiveProfessionalStream::class, 'live_stream_id');
    }
		
		public function messages()
    {
        return $this->hasMany(LiveStreamMessages::class, 'live_stream_id');
    }
		
		
}
