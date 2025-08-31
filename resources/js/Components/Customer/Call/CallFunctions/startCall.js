import createAndSendOffer from './createAndSendOffer';
import createAndSendICE from './createAndSendICE';
import attachConnectionStateHandlers from './attachConnectionStateHandlers';


// shared helper for hold/unhold state
const applyHoldState = (peerConRef, isHolding) => {
  if (!peerConRef?.current) return;

  // Local devices
  peerConRef.current.getSenders().forEach(sender => {
    if (sender.track) sender.track.enabled = !isHolding;
  });

  // Remote devices
  peerConRef.current.getReceivers().forEach(receiver => {
    if (receiver.track) receiver.track.enabled = !isHolding;
  });
};





const startCall = async (ICE_CONFIG, peerConRef, audioCallRef, videoCallRef, localVideoRef, authToken, logedUserData, chatCallData, dispatch) => {
	
	const callType = chatCallData.callType; //audio or video
	
  // Create RTCPeerConnection instance
  peerConRef.current = new RTCPeerConnection(ICE_CONFIG);
	
	 
	//create ice and send to receiver
	await createAndSendICE(peerConRef, authToken, chatCallData, dispatch, true);
	
	
		// Attach connection state listeners
	 attachConnectionStateHandlers(peerConRef, authToken, logedUserData, chatCallData, dispatch);
	
	
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

  // Handle remote stream when it arrives
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
	
	// After everything is set up, check if this user is holding
  const isCurrentUserHolding =
    (chatCallData.callerHold && logedUserData.id === chatCallData.caller.id) ||
    (chatCallData.receiverHold && logedUserData.id === chatCallData.receiver.id);

  if (isCurrentUserHolding) {
    applyHoldState(peerConRef, true);
  }
	
	
	//call function for creating and sending sdp offer to receiver
	createAndSendOffer(peerConRef, authToken, chatCallData, dispatch);
};

export default startCall;
