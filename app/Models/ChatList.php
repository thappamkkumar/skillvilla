<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ChatList extends Model
{
    use HasFactory;
		protected $table = 'chat_lists';
		
		protected $fillable = ['user_one_id', 'user_two_id'];

		 
		//function have Relationship to get data of user, who chat with logged user
		public function getOtherUser($loggedInUserId)
		{
				 if ($this->user_one_id == $loggedInUserId) {
            return $this->belongsTo(User::class, 'user_two_id')
						->select('id','name', 'userID')
						->with([
											'customer:id,user_id,image', 
										])
						->first();
        } else {
            return $this->belongsTo(User::class, 'user_one_id')
						->select('id','name', 'userID')
						->with([
											'customer:id,user_id,image', 
										])
						->first();
        }
    
		}

		// Relationship to get the latest message
    public function latestMessage()
    {
        return $this->hasOne(Message::class)->latest();
    }

		//relationship to get message
    public function messages()
    {
        return $this->hasMany(Message::class);
    }
}
