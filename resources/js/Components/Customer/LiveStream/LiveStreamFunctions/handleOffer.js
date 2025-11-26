import createAndSendAnswer from './createAndSendAnswer';
import createAndSendICE from './createAndSendICE';
import attachConnectionStateHandlers from './attachConnectionStateHandlers';




const handleOffer = async (payload, ICE_CONFIG, peerConRef, publisherVideoRef, localMediaRef, authToken,  liveStreamData,  logedUserData,  dispatch) => {
	  
		if(liveStreamData.publisherId == null || liveStreamData.liveId == null)
		{return;}

		// Create RTCPeerConnection instance
		const peer = new RTCPeerConnection(ICE_CONFIG);
		
		//create ice and send to publisher (logged user id use for filter viewer in publisher side)
		await createAndSendICE(peer, authToken, liveStreamData.publisherId, liveStreamData.liveId, logedUserData.id);
		
		
		
		
		// this is for simple peer. not for obj of peer like publisher has
		// Attach connection state listeners
		//attachConnectionStateHandlers(peer, authToken, publisherId(or viewerId), liveStreamData.liveId, dispatch);
		
		
		
		
		
		
		// Handle remote audio when it arrives (it get media of other user and add to tag. it work or call when media added by other user)
		peer.ontrack = (event) => {
				const video = publisherVideoRef.current;

				if (video) {
						video.srcObject = event.streams[0];
						//video.muted = true;       // Important for autoplay to work in Chrome/Safari
						video.autoplay = true;    // Enables autoplay without click
						video.playsInline = true; // Prevents fullscreen on mobile
						
						video
							.play()
							.catch(err => console.warn("Autoplay error:", err));
				}
		};

		
		
		// important — set caller's offer as the remote description
		await peer.setRemoteDescription(new RTCSessionDescription(payload));

		//call function for creating and sending answer to publisher (logged user id use for filter viewer in publisher side)
		createAndSendAnswer(peer, authToken, liveStreamData.publisherId, liveStreamData.liveId, logedUserData.id);
	 
	 
	 
 
		peerConRef.current = peer;
		
	
	
  };

export default handleOffer;
