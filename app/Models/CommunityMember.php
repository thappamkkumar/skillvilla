<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityMember extends Model
{
    use HasFactory;
		
		protected $table = 'community_members';
		
		protected $fillable = ['community_id', 'user_id', 'role', 'can_share_content'];

		protected $casts = [   
			'can_share_content' => 'boolean',
		];
		
		
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
		
}
