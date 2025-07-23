 
//initial state for store call related data
const chatCallState = {
	callStatus: 'idle',
  callType: null, // 'audio' | 'video'
  caller: null,
  receiver: null,
  callRoomId: null,
  mediaStream: null,
  remoteStream: null,
  incomingCallData: null,
  error: null,
  isMuted: false,
  cameraOn: true,
};
export default chatCallState;