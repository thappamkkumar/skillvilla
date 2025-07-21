<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;
class ProblemSolution extends Model
{
    use HasFactory;
		
		
		protected $table = 'problem_solutions';
		 protected $fillable = [
        'problem_id',
        'user_id',
        'solution',
        'attachment',
    ];
		
		
		protected $appends = ['created_at_human_readable']; 

		/**
		* Function for converting date into human readable form
		**/
		public function getCreatedAtAttribute($value)
    {
      return Carbon::parse($this->attributes['created_at'])->format('d-m-Y');
    }
		public function getCreatedAtHumanReadableAttribute()
    {
      // Format the expires_at value as a human-readable string
      return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }
		
		
		/**
     *Define the relationship with Problem (Many solutions can belong to one problem) 
     */ 
    public function problem()
    {
        return $this->belongsTo(Problem::class);
    }
		/**
     *Define the relationship with User (Many solutions can belong to one user)
     */
    // 
    public function user()
    {
        return $this->belongsTo(User::class);
    }
		
}
