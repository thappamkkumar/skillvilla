<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Community extends Model
{
    use HasFactory;
		
		protected $table = 'communities';
		
		protected $fillable = ['name', 'description', 'privacy', 'created_by', 'content_share_access', 'image'];


    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function members()
    {
        return $this->hasMany(CommunityMember::class);
    }
		
		public function requests()
		{
				return $this->hasMany(CommunityRequest::class);
		}
		
		public function message() {
				return $this->hasMany(CommunityMessage::class);
		}
	
	// Community has many post through pivot table
		public function posts()
    {
			/*return $this->belongsToMany(Post::class, 'community_posts')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();*/
        return $this->belongsToMany(Post::class, 'community_posts');
    }
		
		 // Community has many workfolios through pivot table
    public function workfolios()
    {
        /*
				return $this->belongsToMany(Workfolio::class, 'community_workfolios')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();
										*/
				return $this->belongsToMany(Workfolio::class, 'community_workfolios');						
    }
		
		
		// Community has many problems through pivot table
    public function problems()
    {
        /*return $this->belongsToMany(Problem::class, 'community_problems')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();
									*/
				return $this->belongsToMany(Problem::class, 'community_problems');
    }
		
		
		// Community has many jobs through pivot table
    public function jobs()
    {
       /* return $this->belongsToMany(CompanyJob::class, 'community_jobs')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();
				*/
				 return $this->belongsToMany(CompanyJob::class, 'community_jobs');
    }
		
			// Community has many freelances through pivot table
		public function freelances()
		{
			/*	return $this->belongsToMany(Freelance::class, 'community_freelances')
										->withPivot('sender_id', 'created_at')
										->withTimestamps();
										
				*/
			return $this->belongsToMany(Freelance::class,'community_freelances');
				
		}

		/**
		* Creating has one realtionship with messages for shared community profile
		*
		* @return array<string, string>
		*/ 
    public function sharedCommunityMessage()
    {
        return $this->hasOne(Message::class, 'community_id');
    }
		
		
		
}
