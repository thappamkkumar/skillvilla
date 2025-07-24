<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Call extends Model
{
    use HasFactory;
		protected $table = 'calls';
		
		protected $fillable = [
			'caller_id',
			'receiver_id',
			'call_type',
			'room_id',
			'status',
			'started_at',
			'ended_at',
			'duration_seconds',
	];
	
	
	
	public function caller()
	{
			return $this->belongsTo(User::class, 'caller_id');
	}

	public function receiver()
	{
			return $this->belongsTo(User::class, 'receiver_id');
	}

	public function messages()
	{
			return $this->hasMany(Message::class);
	}
		
		
}
