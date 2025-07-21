<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;
		protected $table = 'companies';
		
		protected $fillable = [
        'user_id', 'name', 'logo', 'website', 'industry', 'description', 'address', 'email', 'phone', 'established_year'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function jobs()
    {
        return $this->hasMany(CompanyJob::class);
    }
}
