<?php

namespace App\Events\LiveStream;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ViewerJoined implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
		 
		public $data;
    public function __construct($data)
    {
      $this->data = $data;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("live-stream.".$this->data['publisher_id']),
        ];
    }
		
		public function broadcastWith(): array
		{
				return [
						'new_viewer' => $this->data['new_viewer'],
						'live_stream_id' => $this->data['live_stream_id']
				];
		}

		public function broadcastAs(): string
		{
				return 'live-stream.new-viewer';
		} 
}
