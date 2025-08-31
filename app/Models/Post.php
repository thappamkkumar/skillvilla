<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Post extends Model
{
    use HasFactory;
		protected $table = 'posts';
		protected $fillable = [
        'user_id',
        'attachment',
        'description', 
        'tags', 
    ];

    protected $casts = [ 
				'attachment' => 'array',
				'tags' => 'array',
    ];
		
		protected $appends = ['created_at_human_readable','created_at_formated']; 

		/**
		* Function for formated created_at
		**/
		public function getCreatedAtFormatedAttribute()
    {
       return Carbon::parse($this->attributes['created_at'])->format('d-m-Y');
    }
		public function getCreatedAtHumanReadableAttribute()
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }

    /**
		* Creating belong to for hasMany realtionship with user
		*
		* @return array<string, string>
		*/

    public function user()
    {
        return $this->belongsTo(User::class);
    }
		/**
		* Creating hasMany realtionship with Comment
		*
		* @return array<string, string>
		*/ 
    public function comments()
    {
        return $this->hasMany(PostComment::class);
    }
		/**
		* Creating hasMany realtionship with Like
		*
		* @return array<string, string>
		*/ 
    public function likes()
    {
        return $this->hasMany(PostLike::class);
    }
		/**
		* Creating hasMany realtionship with post save
		*
		* @return array<string, string>
		*/ 
    public function saves()
    {
        return $this->hasMany(PostSave::class);
				//return $this->belongsToMany(User::class, 'post_saves');
    } 
		
		/**
		* Creating hasMany realtionship with user who save post
		*
		* @return array<string, string>
		*/ 
		
		public function savedPost()
    {
         return $this->belongsToMany(User::class, 'post_saves');
    }
		
		
		/**
		* Creating many to many realtionship with post tags
		*
		* @return array<string, string>
		*/ 
		public function taggedUsers()
    {
        return $this->belongsToMany(User::class, 'post_tags');
    }
		
		 /**
		* Creating many to many realtionship with communities
		*
		* @return array<string, string>
		*/ 
		public function communities()
    {
				/*
				return $this->belongsToMany(Community::class, 'community_posts')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();
					*/
        return $this->belongsToMany(Community::class, 'community_posts');
    }
		
		 
		/**
		* Creating hasOne realtionship with messages for shared post
		*
		* @return array<string, string>
		*/ 
    public function sharedPostMessage()
    {
        return $this->hasOne(Message::class, 'post_id');
    }
		 
}
