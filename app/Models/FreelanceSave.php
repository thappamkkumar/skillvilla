<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FreelanceSave extends Model
{
    use HasFactory;
		protected $table = 'freelance_saves';
		protected $fillable = ['user_id', 'freelance_id'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function freelance()
    {
        return $this->belongsTo(Freelance::class, 'freelance_id');
    }
}
