


const startLiveStream = async (ICE_CONFIG, peerConRef, localMediaRef,   authToken, logedUserData, viewerId,   dispatch) => {
	
  // Create RTCPeerConnection instance
	const peer =   new RTCPeerConnection(ICE_CONFIG);
	
	//create ice and send to receiver
	//await createAndSendICE(peer, authToken, dispatch);
	
	// Attach connection state listeners
	//attachConnectionStateHandlers(peer, authToken, logedUserData,  dispatch);
	
	// Add local tracks to peer connection
  localMediaRef.getTracks().forEach(track => {
			peer.addTrack(track, localStream);
  });
	
	
	
	//check also hold or not
	
	
	
	//call function for creating and sending sdp offer to receiver
	//createAndSendOffer(peer, authToken,  dispatch);




	// store peer in the ref
  if (!peerConRef.current) {
    peerConRef.current = {};
  } 
  peerConRef.current[viewerId] = peer;
	
	
};

export default startLiveStream;
