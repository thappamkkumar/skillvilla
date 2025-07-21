<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityPost extends Model
{
    use HasFactory;
		protected $table = 'community_posts';
		protected $fillable = ['community_id', 'post_id', 'sender_id'];
		
		// CommunityPost belongs to a Community
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    // CommunityPost belongs to a Post
    public function post()
    {
        return $this->belongsTo(Post::class);
    }

    // CommunityPost belongs to the User who shared it
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
}
