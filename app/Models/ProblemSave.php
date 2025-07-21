<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProblemSave extends Model
{
    use HasFactory;
		protected $table = 'problem_saves';
		protected $fillable = ['problem_id', 'user_id'];
}
