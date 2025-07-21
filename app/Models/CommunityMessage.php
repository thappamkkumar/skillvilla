<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class CommunityMessage extends Model
{
    use HasFactory;
		protected $table = "community_messages";
		
		//user_id is sender id
		protected $fillable = [
        'community_id', 'sender_id', 'message',   'attachment' 
    ];
		
		protected $appends = [ 'human_readable_message_time'];
		
		/**
		* Function for converting date into human readable form
		**/
		public function getCreatedAtAttribute( )
    {
       //return Carbon::parse($value)->diffForHumans();
			 return Carbon::parse($this->attributes['created_at'])->format('Y-m-d H:i:s');
		}
		public function getHumanReadableMessageTimeAttribute()
    { 
			 return Carbon::parse($this->attributes['created_at'])->format('h:i A');
		}

		

    public function community()
    {
        return $this->belongsTo(Community::class);
    }

    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }

    
 
}
