<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CompanyJobSave  extends Model
{
    use HasFactory;
		protected $table = 'company_job_saves';
		protected $fillable = ['user_id', 'company_job_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function job()
    {
        return $this->belongsTo(CompanyJob::class, 'company_job_id');
    }
}
