<?php

namespace App\Events\LiveStream;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class Signal implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
		 
		public $toUserId;
		public $liveId; 
    public $payload ;
    public $type;
    public $viewerId;
		
    public function __construct($toUserId, $liveId, $payload, $type, $viewerId)
    {
      $this->toUserId = $toUserId; 
      $this->liveId  = $liveId ;
      $this->payload  = $payload ;
      $this->type  = $type ;
      $this->viewerId  = $viewerId ;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
          new PrivateChannel('live-stream.' . $this->toUserId),
        ];
    }
		
		public function broadcastAs(): string
		{
			return 'live-stream.signal';
		} 
		
		
}
