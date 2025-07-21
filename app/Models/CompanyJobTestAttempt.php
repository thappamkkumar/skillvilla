<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyJobTestAttempt extends Model
{
    use HasFactory;
			protected $table = 'company_job_test_attempts';
		protected $fillable = ['user_id', 'company_job_id', 'score', 'status', 'answers'];

    protected $casts = [
        'answers' => 'array',
				'status' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(CompanyJob::class, 'company_job_id');
    }
		public function applications()
		{
				return $this->hasOne(CompanyJobApplication::class, 'test_attempt_id');
		}

}
