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




const startLiveStream = async (ICE_CONFIG, peerConRef, localMediaRef,   authToken, liveStreamData,   toUserId,    dispatch) => {
	
  // Create RTCPeerConnection instance
	const peer =   new RTCPeerConnection(ICE_CONFIG);
	
	//create ice and send to viewer (null is pass for viewer id (i.e. loged user id) )
	await createAndSendICE(peer, authToken, toUserId, liveStreamData.liveId, null, dispatch);
	
	
	
	
	
	// Add local tracks to peer connection
	if (!localMediaRef.current) {
    return;
  } 
  localMediaRef.current.getTracks().forEach(track => {
			peer.addTrack(track, localMediaRef.current);
  });
	
	 
	
	
	//call function for creating and sending sdp offer to receiver
	createAndSendOffer(peer, authToken, toUserId, liveStreamData.liveId, dispatch);

	// After everything is set up, check if publisher is holding
	if (liveStreamData.publisherHold) {
    applyHoldState(peer, true);
  }


	// store peer in the ref
  if (!peerConRef.current) {
    peerConRef.current = {};
  } 
  peerConRef.current[toUserId] = peer;
	
	//console.log(peerConRef.current);
	
	// Attach connection state listeners
	//toUserId is pass as viewer user id to remove uiewer if needed.
	attachConnectionStateHandlers(peerConRef, peer, authToken, toUserId, liveStreamData.liveId, dispatch, true);
	
	
};

export default startLiveStream;
