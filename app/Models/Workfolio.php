<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Workfolio extends Model
{
    use HasFactory;
		protected $table = 'workfolios';
		
		protected $fillable = [
        'user_id',
        'title',
        'description',
        'category',
        'images',
        'video',
        'other',
    ];

    protected $casts = [
        'images' => 'array', 
        'category' => 'array', 
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
		
		public function user()
    {
        return $this->belongsTo(User::class);
    }
		
		/**
		* Creating hasMany realtionship with WorkfolioReview
		*
		* @return array<string, string>
		*/ 
    public function workfolioReview()
    {
        return $this->hasMany(WorkfolioReview::class);
    }
		
		
	 // Workfolio belongs to multiple communities through pivot table
    public function communities()
    {
      /*  return $this->belongsToMany(Community::class, 'community_workfolios')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();
			*/
				 return $this->belongsToMany(Community::class, 'community_workfolios');
    }
		
		
		/**
		* Creating hasMany realtionship with user who save workfolio
		*
		* @return array<string, string>
		*/ 
		
		public function savedWorkfolio()
    {
       return $this->belongsToMany(User::class, 'workfolio_saves');
    }
		
			 
		/**
		* Creating hasOne realtionship with messages for shared workfolio
		*
		* @return array<string, string>
		*/ 
    public function sharedWorkfolioMessage()
    {
        return $this->hasOne(Message::class, 'workfolio_id');
    }
		
}
