import createAndSendOffer from './createAndSendOffer';
import createAndSendICE from './createAndSendICE';
import attachConnectionStateHandlers from './attachConnectionStateHandlers';

// shared helper for hold/unhold state
const applyHoldState = (peer, isHolding) => {
  if (!peer) return;

  // Local devices
  peer.getSenders().forEach(sender => {
    if (sender.track) sender.track.enabled = !isHolding;
  });

  // Remote devices
  peer.getReceivers().forEach(receiver => {
    if (receiver.track) receiver.track.enabled = !isHolding;
  });
};




const startLiveStream = async (ICE_CONFIG, peerConRef, localMediaRef,   authToken, liveStreamData,   viewerId,    dispatch) => {
	
  // Create RTCPeerConnection instance
	const peer =   new RTCPeerConnection(ICE_CONFIG);
	
	//create ice and send to receiver
	await createAndSendICE(peer, authToken, viewerId, liveStreamData.liveId);
	
	
	// Add local tracks to peer connection
  localMediaRef.getTracks().forEach(track => {
			peer.addTrack(track, localStream);
  });
	
	 
	
	
	//call function for creating and sending sdp offer to receiver
	createAndSendOffer(peer, authToken, viewerId, liveStreamData.liveId);

	// After everything is set up, check if publisher is holding
	if (liveStreamData.publisherHold) {
    applyHoldState(peer, true);
  }


	// store peer in the ref
  if (!peerConRef.current) {
    peerConRef.current = {};
  } 
  peerConRef.current[viewerId] = peer;
	
	
	// Attach connection state listeners
	//attachConnectionStateHandlers(peer, authToken, viewerId, liveStreamData.liveId, dispatch);
	
	
};

export default startLiveStream;
