<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityProblem extends Model
{
    use HasFactory;
		protected $table = 'community_problems';
		protected $fillable = ['community_id', 'problem_id', 'sender_id'];
		
		 // CommunityProblem belongs to a Community
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    // CommunityProblem belongs to a Problem
    public function problem()
    {
        return $this->belongsTo(Problem::class);
    }

    // CommunityProblem belongs to the User who shared it
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
