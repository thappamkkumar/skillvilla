<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ContactMessage extends Model
{
    use HasFactory;
		protected $table = 'contact_messages';
		
		protected $fillable = ['name', 'email', 'message'];
		
		protected $appends = ['formated_date','formated_time']; 

		/**
		* Function for formated created_at into date
		**/
		public function getFormatedDateAttribute()
    {
       return Carbon::parse($this->attributes['created_at'])->format('d-m-Y');
    }
		/**
		* Function for formated created_at into time
		**/
		public function getFormatedTimeAttribute()
    {
        
        return Carbon::parse($this->attributes['created_at'])->format('h:i A');
    }
		
}
