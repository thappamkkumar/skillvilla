<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Message extends Model
{
    use HasFactory;
		protected $table = 'messages';
		
    protected $fillable = [
		'chat_list_id', 
		'sender_id', 
		'message', 
		'is_read', 
		'attachment',
		'call_id',
		'post_id',
		'post_id',
		'workfolio_id',
		'problem_id',
		'company_job_id',
		'freelance_id',
		'stories_id',
		'community_id',
		'user_id', 
		];
		
		protected $appends = [ 'human_readable_message_time'];

		
		protected $casts = [
        'is_read' => 'boolean', // Ensure 'read_status' is cast to a boolean
    ];
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

		
		 /**
     * Get the truncated version of the message.
     *
     * @return string
     */
		public function getTruncateMessageAttribute()
		{
			$maxLength = 100; // Number of characters
			$message = $this->attributes['message'];;

			return strlen($message) > $maxLength ? substr($message, 0, $maxLength) : $message;
		}
		/**
    * Get the full overview.
    *
    * @return string
    */
    public function getOverviewAttribute()
    {
        return $this->attributes['message'];
    }


    public function chat()
    {
        return $this->belongsTo(ChatList::class);
    }
		
		//relation with call 
		 public function call(): BelongsTo
    {
        return $this->belongsTo(Call::class);
    }
		
		//realtion with sender user
    public function sender()
    {
        return $this->belongsTo(User::class, 'sender_id');
    }
		
		//relation with user whose profile had shared in chat message
		public function sharedUser()
		{
			return $this->belongsTo(User::class, 'user_id');
		}
		
		//relation with community whose profile had shared in chat message
		public function sharedCommunity()
		{
			return $this->belongsTo(Community::class, 'community_id');
		}
		
		//relation with stories that shared in chat message
		public function sharedStory()
		{
			return $this->belongsTo(Stories::class, 'stories_id');
		}
		
		//relation with Freelance that shared in chat message
		public function sharedFreelance()
		{
			return $this->belongsTo(Freelance::class, 'freelance_id');
		}
		
		//relation with job that shared in chat message
		public function sharedJob()
		{
			return $this->belongsTo(CompanyJob::class, 'company_job_id');
		}
		
		//relation with problem that shared in chat message
		public function sharedProblem()
		{
			return $this->belongsTo(Problem::class, 'problem_id');
		}
		
		//relation with workfolio that shared in chat message
		public function sharedWorkfolio()
		{
			return $this->belongsTo(Workfolio::class, 'workfolio_id');
		} 
		//relation with post that shared in chat message
		public function sharedPost()
		{
			return $this->belongsTo(Post::class, 'post_id');
		} 
		
		
		
		
		
}
