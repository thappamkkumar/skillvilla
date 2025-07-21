<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class PostComment extends Model
{
    use HasFactory;
		
		protected $table = 'post_comments';
    protected $fillable = ['post_id', 'user_id', 'comment'];
			
		protected $appends = ['created_at_human_readable']; 

		/**
		* Function for converting date into human readable form
		**/
		public function getCreatedAtAttribute($value)
    {
       return Carbon::parse($this->attributes['created_at'])->format('d-m-Y');
    }
		public function getCreatedAtHumanReadableAttribute()
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }
		
		/**
		* Function for converting date into human readable form
		**/
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function post()
    {
        return $this->belongsTo(Post::class);
    }
}
