<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityWorkfolio extends Model
{
    use HasFactory;
		protected $table = 'community_workfolios';
		protected $fillable = ['community_id', 'workfolio_id', 'sender_id'];
		
		// CommunityWorkfolio belongs to a Community
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    // CommunityWorkfolio belongs to a Workfolio
    public function workfolio()
    {
        return $this->belongsTo(Workfolio::class);
    }

    // CommunityWorkfolio belongs to the User who shared it
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
		
		
}
