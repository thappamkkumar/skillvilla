import createAndSendOffer from './createAndSendOffer';
import createAndSendICE from './createAndSendICE';

const startCall = async (ICE_CONFIG, peerConRef, audioCallRef, authToken, chatCallData, dispatch) => {
  // Create RTCPeerConnection instance
  peerConRef.current = new RTCPeerConnection(ICE_CONFIG);
	
	//create ice and send to receiver
	await createAndSendICE(peerConRef, authToken, chatCallData, true);
	

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
	
	//call function for creating and sending sdp offer to receiver
	createAndSendOffer(peerConRef, authToken, chatCallData, dispatch);
};

export default startCall;
