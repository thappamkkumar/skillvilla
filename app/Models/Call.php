<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;
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
			'caller_hold',
			'receiver_hold',
			'started_at',
			'ended_at',
			 
	];
	
	protected function casts(): array
	{
			return [ 
					'caller_hold' => 'boolean',
					'receiver_hold' => 'boolean'
				];
	}
	public function getDurationInSecondsAttribute()
	{
    if (!$this->started_at || !$this->ended_at) {
        return null; // or return 0 if you prefer
    }

    return Carbon::parse($this->ended_at)->diffInSeconds(Carbon::parse($this->started_at));
	}
	
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
