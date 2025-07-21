<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyJobTestQuestionOption extends Model
{
    use HasFactory;
			protected $table = 'company_job_test_question_options';
		protected $fillable = ['question_id', 'option', 'is_correct'];
		
		protected $casts = [ 
			'is_correct' => 'boolean',
		];
    public function testQuestion()
    {
        return $this->belongsTo(JobTestQuestion::class, 'question_id');
    }
}
