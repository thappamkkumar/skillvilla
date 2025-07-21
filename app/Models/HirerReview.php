<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

// this model is use for storing review of hirer on freelance. here store review about the freelance work and etc. basicaly in short it is for hirer
class HirerReview extends Model
{
    use HasFactory;
		
		protected $table = 'hirer_reviews';
		
		protected $fillable = [
        'user_id',//hirer
        'freelancer_id',
        'review',
        'rating',
    ];
		
		/**
		* Function for converting date into human readable form
		**/
		public function getCreatedAtAttribute($value)
    {
       return Carbon::parse($value)->format('d-m-Y');
    }
		public function getCreatedAtHumanReadableAttribute()
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }
		
    /**
     * Relationship with User (Hirer).
     */
    public function hirer()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Relationship with User (Freelancer).
     */
    public function freelancer()
    {
        return $this->belongsTo(User::class, 'freelancer_id');
    }
}
