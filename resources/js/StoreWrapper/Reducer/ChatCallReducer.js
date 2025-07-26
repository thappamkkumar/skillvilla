//reducer for Chat Call data
 
const ChatCallReducer = { 
    updateChatCallState(state, action)
    {  
			switch (action.payload.type)
			{
				
				case "initiatingCall": 
				{
					const callData = action.payload.initiatingCall;
					
					state.callId= callData.callId;
					state.callStatus= callData.callStatus;
					state.callType= callData.callType;
					state.caller= callData.caller;
					state.receiver= callData.receiver;
					state.callRoomId= callData.callRoomId;
					 
					break;
				}
				
					 
					 
					
					
					
					
				case "incomingCallReceived": 
					state.callStatus = 'incoming';
					state.incomingCallData = action.payload.incomingCallData;
					break;  
					 
				case "acceptCall": 
					state.callStatus = 'in-call';
					state.callType = action.payload.callType;
					state.caller = action.payload.caller;
					state.callRoomId = action.payload.callRoomId;
					break;  
				
				case "endCall": 
					state.callStatus = 'ended';
					state.mediaStream?.getTracks().forEach(t => t.stop());
					state.mediaStream = null;
					state.remoteStream = null;
					break;  
				
				case "setLocalStream": 
					state.mediaStream = action.payload;
					break;  
					 
				case "setRemoteStream": 
					state.remoteStream = action.payload;
					break;  
					 
				case "setMuted": 
					state.isMuted = action.payload;
					break;  
				
				case "toggleCamera": 
					 state.cameraOn = !state.cameraOn;
					break;  
					 
				case "setError": 
					  state.error = action.payload;
					break;  
					 
				
					
				case "refresh": {
					state.callStatus = 'idle';
					state.callType = null;
					state.caller = null;
					state.receiver = null;
					state.callRoomId = null;
					state.mediaStream = null;
					state.remoteStream = null;
					state.incomingCallData = null;
					state.error = null;
					state.isMuted = false;
					state.cameraOn = true;
					break;
				}
				
				default: 
					break;
							
			}
		},
		 
     
}


export default ChatCallReducer;