<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class CompanyJobApplication extends Model
{
    use HasFactory;
		
		protected $table = 'company_job_applications';
    protected $fillable = ['user_id', 'company_job_id', 'test_attempt_id', 'resume', 'self_introduction','status'];

		 
		
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

		
		
    public function user()
    {
        return $this->belongsTo(User::class);
    }
	
    public function job()
    {
        return $this->belongsTo(CompanyJob::class,'company_job_id');
    }

    public function testAttempt()
    {
        return $this->belongsTo(CompanyJobTestAttempt::class, 'test_attempt_id');
    }
}
