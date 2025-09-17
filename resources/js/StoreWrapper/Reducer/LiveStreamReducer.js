// reducer for live stream

const LiveStreamReducer = {
	
	updateLiveStreamState(state, action){
		
		switch(action.payload.type)
		{
			
			case "liveStreamStart":
			{
				const liveStreamData = action.payload.data;
				 
				state.liveId = liveStreamData.id;
				state.liveStatus = 'live';
				
				state.publisher = liveStreamData.publisher;
				state.liveType = liveStreamData.live_type;
				
				state.startedAt = liveStreamData.started_at; 
				
				
				break;
			}
			
			case "refresh":
			{
				 
				state.liveId = null;
				state.liveType = null;
				state.startedAt = null;
				state.liveStatus = 'idle';
				state.totalViewer = null;
				
				state.liveSession = null;  
				state.liveDetail = null;   
				
				state.publisherHold = false;
				state.publisher = null;
				
				state.viewerList = []; 
				state.currentViewer = null;  
				
				state.isMuted = false;
				state.cameraOn = true;
				state.speakerOff = false; 
				
				state.micId = null;
				state.speakerId =  null;
				state.cameraId =null;
				
				state.isConnecting = false;
				
				state.error = null;
				
				state.joinedRequest = [];
			}
			
			default : {
				break;
			}
			
			
		};
		
		
	},

};

export default LiveStreamReducer;