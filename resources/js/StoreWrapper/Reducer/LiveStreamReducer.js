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
				
				state.publisherId = liveStreamData.publisher.id;
				state.publisher = liveStreamData.publisher;
				state.liveType = liveStreamData.live_type;
				
				state.startedAt = liveStreamData.started_at; 
				
				
				break;
			}
			
			
			//add new viewer on publisher side 
			case "addNewViewer":
			{  
				const {liveId, newViewer} = action.payload.newViewerData;
				if(liveId !== state.liveId) break;
				
				const viewer = {
					...newViewer,
					isConnecting: true,
					error: null ,
				}
				state.viewerList = [viewer, ...state.viewerList];
				state.totalViewer = (state.totalViewer || 0 ) + 1;

				break;
			}
			
			case "removeViewer":
			{
				const {liveId, viewerUserId} = action.payload.liveData;
				
				state.viewerList = state.viewerList.filter(item => item.viewer_id != viewerUserId);
				if(state.totalViewer != null && state.totalViewer > 1)
				{
					state.totalViewer--;
				} 
				 
				break;
			}
			
			
			case "updateViewerCan":
			{
				const {liveId, viewerId, type, can_do} = action.payload.updatedData;
				if(liveId !== state.liveId) break;
				
				state.viewerList = state.viewerList.map(viewer => {
								if (viewer.id === viewerId) 
								{
									if(type === "can_live")
									{
										viewer.can_live = can_do;
									}
									if(type === "can_message")
									{
										viewer.can_message = can_do;
									}
								}
								return viewer;
						});
				break;
			}
			
			//this is for publisher side
			case "updateViewerConnectionStatusAndError":
			{
				 
				const {viewerUserId, isConnecting, error} = action.payload.viewerData;
				 
				state.viewerList = state.viewerList.map(viewer => {
								if (viewer.viewer_id === viewerUserId) 
								{
									 viewer.isConnecting = isConnecting;
									 viewer.error = error;
									 
								}
								return viewer;
						});
				break;
			}
			
			//this is for viewer side 
			case "updateCurrentViewerConnectionStatusAndError":
			{
				const {viewerId, isConnecting, error} = action.payload.currentViewerData;
				
				if(state.currentViewer?.viewer_id == viewerId)
				{
					state.isConnecting = isConnecting;
					state.error = error;
				}
				break;
			}
			
			
			
			
			//current viewer start watching stream "viewer side how start watching only"
			case "viewerStartWatchingStream":
			{
				const liveData = action.payload.data;
				
				state.liveId = liveData.liveId;
				state.liveStatus = 'live';
				
				state.publisherId = liveData.publisherId;
				
				state.currentViewer = liveData.viewer;
				
				state.startedAt = liveData.startedAt;
				
				state.chatMessages = liveData.messages; 
				state.isConnecting = true;
				state.error = null;
				
				break;
			}
			
			case "newMessage":
			{
				const {messageId, liveId, newMessage, senderId, sender} = action.payload.data;
				if(liveId !== state.liveId) break;
				 
				const message = {
					id: messageId,
					message: newMessage,
					live_stream_id: liveId,
					sender_id: senderId,
					sender: sender,
				};

				state.chatMessages = [...state.chatMessages, message];

			 
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
				state.publisherId = null;
				
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
				state.chatMessages = [];
				
				break;
			}
			
			default : {
				break;
			}
			
			
		};
		
		
	},

};

export default LiveStreamReducer;