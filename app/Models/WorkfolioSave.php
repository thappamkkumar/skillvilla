<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WorkfolioSave extends Model
{
    use HasFactory;
		protected $table = 'workfolio_saves';
		protected $fillable = ['user_id', 'workfolio_id'];
}
