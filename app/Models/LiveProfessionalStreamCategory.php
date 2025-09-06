<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LiveProfessionalStreamCategory extends Model
{
    use HasFactory;
		
		protected $table = 'live_professional_stream_categories';
		
		protected $fillable = [
        'name',
        'icon',
        'description',
        'is_active',
    ];
		
		public function professionalStreams()
    {
        return $this->hasMany(LiveProfessionalStream::class, 'category_id');
    }
		
}
