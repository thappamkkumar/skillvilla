<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveProfessionalStream extends Model
{
    use HasFactory;
		
		protected $table = 'live_professional_streams';
		
		protected $fillable = [
        'live_stream_id',
				'category_id',
        'title',
        'description',
    ];
		
		public function liveStream()
    {
        return $this->belongsTo(LiveStream::class, 'live_stream_id');
    }

    public function category()
    {
        return $this->belongsTo(LiveProfessionalStreamCategory::class, 'category_id');
    }

    public function sessions()
    {
        return $this->hasMany(LiveProfessionalStreamSession::class, 'live_professional_stream_id');
    }

}
