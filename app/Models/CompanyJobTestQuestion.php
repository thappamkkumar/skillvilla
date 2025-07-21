<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyJobTestQuestion extends Model
{
    use HasFactory;
			protected $table = 'company_job_test_questions';
		protected $fillable = ['company_job_id', 'question',  ];

    public function job()
    {
        return $this->belongsTo(CompanyJob::class, 'company_job_id');
    }

    public function options()
    {
        return $this->hasMany(CompanyJobTestQuestionOption::class,'question_id');
    }
}
