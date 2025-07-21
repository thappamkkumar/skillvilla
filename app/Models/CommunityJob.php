<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CommunityJob extends Model
{
    use HasFactory;
		protected $table = 'community_jobs';
		protected $fillable = ['community_id', 'company_job_id', 'sender_id'];
		
    // CommunityJob belongs to a Community
    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    // CommunityJob belongs to a CompanyJob
    public function companyJob()
    {
        return $this->belongsTo(CompanyJob::class);
    }

    // CommunityJob belongs to the User who shared it
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    } 
}
