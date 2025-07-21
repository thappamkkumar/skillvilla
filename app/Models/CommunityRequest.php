<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityRequest extends Model
{
    use HasFactory;
		
		protected $table = 'community_requests';
		
		protected $fillable = ['community_id', 'user_id', 'status'];

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
