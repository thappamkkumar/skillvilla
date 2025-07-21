<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Carbon\Carbon;
class Problem extends Model
{
    use HasFactory;
		protected $table = 'problems';
		
		protected $fillable = [
        'title',
        'description',
        'attachment',
        'url',
        'user_id',
    ];

		protected $appends = ['created_at_human_readable','created_at_formated']; 

		/**
		* Function for formated created_at
		**/
		public function getCreatedAtFormatedAttribute()
    {
       return Carbon::parse($this->attributes['created_at'])->format('d-m-Y');
    }
		public function getCreatedAtHumanReadableAttribute()
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }

    /**
     * Get the user that owns the problem.
     */
    public function user()
    {
        return $this->belongsTo(User::class); // Problem belongs to one user
    }
		/**
     * Define the relationship with Solution (One problem can have many solutions)
     */
		public function solutions()
    {
        return $this->hasMany(ProblemSolution::class);
    }
		
		
	 // Problem belongs to multiple communities through pivot table
    public function communities()
    {
      /*  return $this->belongsToMany(Community::class, 'community_problems')
                    ->withPivot('sender_id', 'created_at')
                    ->withTimestamps();
				*/
				return $this->belongsToMany(Community::class, 'community_problems');
		
		}
		
		/**
		* Creating hasMany realtionship with user who save problem
		*
		* @return array<string, string>
		*/ 
		
		public function savedProblem()
    {
       return $this->belongsToMany(User::class, 'problem_saves');
    }
		
			 
		/**
		* Creating hasOne realtionship with messages for shared problem
		*
		* @return array<string, string>
		*/ 
    public function sharedProblemMessage()
    {
        return $this->hasOne(Message::class, 'problem_id');
    }
}
