import createAndSendAnswer from './createAndSendAnswer';
import createAndSendICE from './createAndSendICE';

const handleOffer = async (payload, ICE_CONFIG, peerConRef, audioCallRef, authToken, chatCallData, dispatch) => {
  // Create RTCPeerConnection instance
  peerConRef.current = new RTCPeerConnection(ICE_CONFIG);
	
	//create ice and send to caller
	await createAndSendICE(peerConRef, authToken, chatCallData, false);
	
	
  // Get local audio stream
  const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });

  // Add local tracks to peer connection
  localStream.getTracks().forEach(track => {
    peerConRef.current.addTrack(track, localStream);
  });
	
  // Handle remote audio when it arrives
  peerConRef.current.ontrack = (event) => {
    if (audioCallRef.current) {
      audioCallRef.current.srcObject = event.streams[0];
			
      audioCallRef.current
        .play()
        .catch((e) => {
          console.warn("Autoplay failed:", e); // Might need user gesture
        });
    }
  };
 
	 
	// important — set caller's offer as the remote description
  await peerConRef.current.setRemoteDescription(new RTCSessionDescription(payload));

	//call function for creating and sending answer to caller
	 createAndSendAnswer(peerConRef, authToken, chatCallData, dispatch);
};

export default handleOffer;
