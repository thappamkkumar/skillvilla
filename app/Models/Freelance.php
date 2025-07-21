<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class Freelance extends Model
{
    use HasFactory;
		
		protected $table = 'freelances';
		protected $fillable = [ 
			'user_id',
			'title',
			'description',
			'skill_required',
			'budget_min',
			'budget_max',
			'payment_type',
			'deadline', 
			'experience_level',
			'duration',
				
    ];
		
		
		 protected $casts = [ 
				'skill_required' => 'array',
    ];
		
		protected $appends = ['is_expired','deadline_human_readable', 'created_at_human_readable','created_at_formated']; 

		
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
		
		public function getDeadlineAttribute($value)
    {
        return Carbon::parse($value)->format('d-m-Y');
    }
		public function getDeadlineHumanReadableAttribute($value)
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['deadline'])->diffForHumans();
    }
		public function getIsExpiredAttribute()
		{
				// Check if the current date is after the expiration date
				return Carbon::now()->gt(Carbon::parse($this->attributes['deadline']));
		}
		
		//relations
		public function user()
		{
				return $this->belongsTo(User::class);
		}

		public function savedFreelance()
		{
				return $this->hasMany(FreelanceSave::class);
		}
		
		public function bids()
		{
				return $this->hasMany(FreelanceBid::class,'freelance_id');
		}
		
		// freelance belongs to multiple communities through pivot table
		public function communities()
		{ 		
				return $this->belongsToMany(Community::class, 'community_freelances');
		}

		 
		/**
		* Creating hasOne realtionship with messages for shared freelance
		*
		* @return array<string, string>
		*/ 
    public function sharedFreelanceMessage()
    {
        return $this->hasOne(Message::class, 'freelance_id');
    }
		
}
