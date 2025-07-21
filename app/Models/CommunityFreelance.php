<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityFreelance extends Model
{
    use HasFactory;
		protected $table = 'community_freelances';
		protected $fillable = ['community_id', 'freelance_id', 'sender_id'];
		
		public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function freelance()
    {
        return $this->belongsTo(Freelance::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
		
		
}
