<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatCallAcceptedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;
			
    /**
     * Create a new event instance.
     */
		
		public $fromUser;
    public $toUserId;
    public $callRoomId;
		
    public function __construct($fromUser, $toUserId, $callRoomId)
    {
      $this->fromUser = $fromUser;
			$this->toUserId = $toUserId;
			$this->callRoomId = $callRoomId;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new  PrivateChannel('call.' . $this->toUserId);
        ];
    }
}
