import createAndSendAnswer from './createAndSendAnswer';
import createAndSendICE from './createAndSendICE';

const handleOffer = async (payload, ICE_CONFIG, peerConRef, audioCallRef, videoCallRef, localVideoRef, authToken, chatCallData, dispatch) => {
  
	const callType = chatCallData.callType; //audio or video
	
	// Create RTCPeerConnection instance
  peerConRef.current = new RTCPeerConnection(ICE_CONFIG);
	
	//create ice and send to caller
	await createAndSendICE(peerConRef, authToken, chatCallData, dispatch, false);
	
	
  // Choose constraints based on call type
  const constraints =
    callType === 'video'
      ? { audio: true, video: true }
      : { audio: true, video: false };
			
  // Get local   stream
  const localStream = await navigator.mediaDevices.getUserMedia(constraints);

  // Add local tracks to peer connection
  localStream.getTracks().forEach(track => {
    peerConRef.current.addTrack(track, localStream);
  });
	
	
	
	//  Attach local video for video calls
  if (callType === 'video' && localVideoRef.current) { 
    localVideoRef.current.srcObject = localStream; 
  }
	
	
  // Handle remote audio when it arrives
  peerConRef.current.ontrack = (event) => {
		
    if (callType === 'audio' && audioCallRef.current) {
      // Play remote audio
      audioCallRef.current.srcObject = event.streams[0];
      audioCallRef.current
        .play()
        .catch((e) => console.warn('Autoplay failed:', e));
    }
		else if (callType === 'video' && videoCallRef.current) {
      // TODO: attach event.streams[0] to a video element
       
        videoCallRef.current.srcObject = event.streams[0];
        videoCallRef.current
          .play()
          .catch((e) => console.warn('Video autoplay failed:', e));
       
    }
		
  };
 
	 
	// important — set caller's offer as the remote description
  await peerConRef.current.setRemoteDescription(new RTCSessionDescription(payload));

	//call function for creating and sending answer to caller
	 createAndSendAnswer(peerConRef, authToken, chatCallData, dispatch);
};

export default handleOffer;
