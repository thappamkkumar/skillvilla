//reducer for Chat Call data
 
const ChatCallReducer = { 
    updateChatCallState(state, action)
    {  
			switch (action.payload.type)
			{
				
				case "initiatingCall": 
				{
					const callData = action.payload.initiatingCall;
					
					state.chatId= callData.chatId;
					state.callId= callData.callId;
					state.callStatus= callData.callStatus;
					state.callType= callData.callType;
					state.caller= callData.caller;
					state.receiver= callData.receiver;
					state.callRoomId= callData.callRoomId;
					 
					break;
				}
				
				case "endCall": 
				{
					const callId =  action.payload.callId;
					if(callId !== state.callId )
					{
						return;
					}
					state.callStatus = 'idle';
					state.callId = null;
					state.chatId = null;
					state.callType = null;
					state.caller = null;
					state.receiver = null;
					state.callRoomId = null;
					//state.mediaStream?.getTracks().forEach(t => t.stop());
					state.mediaStream = null;
					state.remoteStream = null;
					state.incomingCallData = null;
					state.error = null;
					state.isMuted = false;
					state.cameraOn = true;
					state.speakerOff = false;
					state.isHold = false;
					state.micId = null;
					state.speakerId = null;
					state.cameraId = null;
					break; 	 
				}
						 
			 
				case "incomingCallReceived":
				{
					const callData = action.payload.incomingCallData;
					
					state.chatId= callData.chatId;
					state.callId= callData.callId;
					state.callStatus= callData.callStatus;
					state.callType= callData.callType;
					state.caller= callData.caller;
					state.receiver= callData.receiver;
					state.callRoomId= callData.callRoomId;
					
					state.incomingCallData = callData;
					break;  
					
				}
				
					 
				case "acceptCall": 
				{
					const callId = action.payload.callId;
					 
					if(callId !== state.callId )
					{
						return;
					}
					state.callStatus = 'in-call';
					state.startedAt = new Date().toISOString();  //remove it

					break;  
					
				}
					
				
				case "rejectCall":
				{				
					state.callStatus = 'idle';
					state.callType = null;
					state.caller = null;
					state.receiver = null;
					state.callRoomId = null;
					//state.mediaStream?.getTracks().forEach(t => t.stop());
					state.mediaStream = null;
					state.remoteStream = null;
					state.incomingCallData = null;
					state.error = null;
					state.isMuted = false;
					state.cameraOn = true;
					speakerOff = false;
					isHold = false;
					micId = null;
					speakerId = null;
					cameraId = null;
					break;  
				}
				
				case "holdCall":
				{		 
					state.isHold = !state.isHold;
					break;  
				}
				
				case "setMic":
				{		 
					state.micId=action.payload.micId;
					if(action.payload.micId === 'off')
					{
						state.isMuted = true;
					}
					else if(state.isMuted)
					{
						state.isMuted = false;
					}
					else
					{}
					break;  
				}
				case "setSpeaker":
				{		 
					state.speakerId = action.payload.speakerId;
					if(action.payload.speakerId === 'off')
					{
						state.speakerOff = true;
					}
					else if(state.speakerOff)
					{
						state.speakerOff = false;
					}
					else
					{}
					break;  
				}
				case "setCamera":
				{		  
					state.cameraId = action.payload.cameraId;
					if(action.payload.cameraId === 'off')
					{
						state.cameraOn = false;
					}
					else if(!state.cameraOn)
					{
						state.cameraOn = true;
					}
					else
					{}
					break;  
				}
			 
				
				
				 
				
				case "setLocalStream": 
					state.mediaStream = action.payload;
					break;  
					 
				case "setRemoteStream": 
					state.remoteStream = action.payload;
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
					state.speakerOff = false;
					state.isHold = false;
					state.micId = null;
					state.speakerId = null;
					state.cameraId = null;
					break;
				}
				
				default: 
					break;
							
			}
		},
		 
     
}


export default ChatCallReducer;