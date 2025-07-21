<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;
		protected $table = 'customers';
		/**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
		protected $fillable = [
        'user_id', 'mobile_number', 'city_village', 'state', 'country', 'interest', 'about', 'image',
    ];
		/**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected $casts = [
        'interest' => 'array',
    ];
		/**
		* Creating hasOne realtionship with user
		*
		* @return array<string, string>
		*/ 
		public function user()
    {
        return $this->belongsTo(User::class);
    }
}
