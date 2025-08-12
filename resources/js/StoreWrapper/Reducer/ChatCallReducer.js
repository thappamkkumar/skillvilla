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
					state.initiatedAt= callData.initiatedAt;
					 
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
					state.callerHold = false;
					state.receiverHold = false;
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
					state.initiatedAt= callData.initiatedAt;
					
					state.incomingCallData = callData;
					break;  
					
				}
				
					 
				case "acceptCall": 
				{
					const callData = action.payload.callData;
					 
					if(callData.callId !== state.callId )
					{
						return;
					}
					state.callStatus = 'in-call';
					state.startedAt = callData.startedAt;  //remove it

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
					state.speakerOff = false;
					state.callerHold = false;
					state.receiverHold = false;
					state.micId = null;
					state.speakerId = null;
					state.cameraId = null;
					break;  
				}
				
				case "holdCall":
				{		 
					const holdData = action.payload.holdData;
					if(holdData.callId !== state.callId) 
					{
						return;
					}
					state.callerHold = holdData.callerHold;
					state.receiverHold = holdData.receiverHold;
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
			 
				case "setError": 
					  state.error = action.payload.error;
					break;  
					 
				
				 
				
				case "setLocalStream": 
					state.mediaStream = action.payload;
					break;  
					 
				case "setRemoteStream": 
					state.remoteStream = action.payload;
					break;  
					 
				 
				 
				
				
				case "setActiveCallData": {
					const callData = action.payload.callData;
					
					state.chatId = callData.chatId;
					state.callId = callData.callId;
					state.callStatus = callData.callStatus;
					state.callType = callData.callType;
					state.startedAt = callData.startedAt;
					state.initiatedAt = callData.initiatedAt;
					state.caller = callData.caller;
					state.receiver = callData.receiver;
					state.callRoomId = callData.callRoomId;
					
					state.callerHold = callData.callerHold;
					state.receiverHold = callData.receiverHold; 
					state.micId = callData.micId;
					state.speakerId = callData.speakerId;
					state.cameraId = callData.cameraId; 
					
					state.incomingCallData = callData.incomingCallData;
					
					break;
				}	
				case "refresh": {
					state.chatId = null;
					state.callId = null;
					state.callStatus = 'idle';
					state.callType = null;
					state.startedAt = null;
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
					state.callerHold = false;
					state.receiverHold = false;
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