<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Stories extends Model
{
    use HasFactory;
		protected $table = 'stories';
		
		protected $fillable = ['user_id', 'story_file', 'expires_at'];



	/*	protected static function booted()
		{
				parent::boot();
				static::creating(function ($story) {
						$story->expires_at = now()->addHours(24);
						//$story->save();
				});
		}*/


		protected $appends = ['created_at_human_readable']; 

		/**
		* Function for converting date into human readable form
		**/
		public function getCreatedAtAttribute($value)
    {
       return Carbon::parse($value)->format('d-m-Y');
    }
		public function getCreatedAtHumanReadableAttribute()
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }

		

    /**
     * Get the user that owns the stories.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
		/**
		* Creating hasMany realtionship with Like
		*
		* @return array<string, string>
		*/ 
    public function likes()
    {
        return $this->hasMany(StoriesLike::class);
    }
		/**
		* Creating hasMany realtionship with comments
		*
		* @return array<string, string>
		*/ 
    public function comments()
    {
        return $this->hasMany(StoriesComment::class);
    }
		
		
		/**
		* Creating has one realtionship with messages for shared story  
		*
		* @return array<string, string>
		*/ 
    public function sharedCommunityMessage()
    {
        return $this->hasOne(Message::class, 'stories_id');
    }
		
		
}
