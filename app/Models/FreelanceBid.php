<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
class FreelanceBid extends Model
{
    use HasFactory;
		
		protected $table = 'freelance_bids';
    protected $fillable = [
		'freelance_id',
		'user_id',
		'cover_letter', 
		'bid_amount',
		'payment_type',
		'delivery_time',
		'status',
		//'previous_project',
		];

	/*	 protected $casts = [ 
				'previous_project' => 'array',
    ]; */
		
		protected $appends = ['created_at_human_readable']; 


		public function getCreatedAtAttribute($value)
    {
       return Carbon::parse($value)->format('d-m-Y');
    }
		public function getCreatedAtHumanReadableAttribute()
    {
        // Format the expires_at value as a human-readable string
        return Carbon::parse($this->attributes['created_at'])->diffForHumans();
    }
		
		//relations
    public function user()
    {
        return $this->belongsTo(User::class);
    }
	
    public function freelance()
    {
        return $this->belongsTo(Freelance::class,'company_job_id');
    }

     
		
}
