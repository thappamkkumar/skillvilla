<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CompanyJob extends Model
{
    use HasFactory;
		protected $table = 'company_jobs';
		
		protected $fillable = [
        'user_id', 'company_id', 'title', 'description', 'salary', 'payment_type', 'job_location', 'employment_type', 'expires_at', 'skill_required', 'email', 'phone', 'work_from_home', 'communication_language','time_limit'
    ];
		 
		protected $casts = [
			'skill_required' => 'array',  // Cast skill_required as an array when fetching
			'work_from_home' => 'boolean',
		];

    protected $appends = ['is_expired', 'expires_at_human_readable', 'created_at_human_readable','created_at_formated'];


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
	
		public function getExpiresAtAttribute($value)
    {
        return Carbon::parse($value)->format('d-m-Y');
    }
		
		
		public function getExpiresAtHumanReadableAttribute()
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['expires_at'])->diffForHumans();
    }
		public function getIsExpiredAttribute()
		{
				// Check if the current date is after the expiration date
				return Carbon::now()->gt(Carbon::parse($this->attributes['expires_at']));
		}
		
    public function company()
    {
        return $this->belongsTo(Company::class, 'company_id');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function savedJobs()
    {
        return $this->hasMany(CompanyJobSave::class);
    }

    public function testQuestions()
    {
        return $this->hasMany(CompanyJobTestQuestion::class);
    }

    public function attempts()
    {
        return $this->hasMany(CompanyJobTestAttempt::class, 'company_job_id');
    }
		
		public function applications()
    {
        return $this->hasMany(CompanyJobApplication::class,'company_job_id');
    }
		
		// Job belongs to multiple communities through pivot table
    public function communities()
    {
      /*  return $this->belongsToMany(Community::class, 'community_jobs')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();
				*/
			return $this->belongsToMany(Community::class, 'community_jobs');
    }
	 
		/**
		* Creating hasOne realtionship with messages for shared job vacancy
		*
		* @return array<string, string>
		*/ 
    public function sharedJobMessage()
    {
        return $this->hasOne(Message::class, 'company_job_id');
    }
 
}
