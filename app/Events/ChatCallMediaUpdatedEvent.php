<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChatCallMediaUpdatedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
		
		public $toUserId;
    public $fromUserId;
    public $mediaStatus; // e.g. ['audio' => true, 'video' => false]
    public function __construct($toUserId, $fromUserId, $mediaStatus)
    {
      $this->toUserId = $toUserId;
      $this->fromUserId = $fromUserId;
      $this->mediaStatus = $mediaStatus;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
          new PrivateChannel('call.' . $this->toUserId);
        ];
    }
}
