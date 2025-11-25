

/*



const attachPeerConnectionStateHandlers = (
  peerConRef,
  onStateChange
) => {

  const attachHandler = (pc, key) => {
    pc.onconnectionstatechange = () => {
      const state = pc.connectionState;

      onStateChange(state, key); // key = peerId or null
    };
  };

  const peerCon = peerConRef.current;

  // Viewer (single connection)
  if (peerCon instanceof RTCPeerConnection) {
    attachHandler(peerCon, null);
    return;
  }

  // Publisher (multiple connections)
  Object.keys(peerCon).forEach(key => {
    attachHandler(peerCon[key], key);
  });
};


*/


// in this file it dne for per viewer. use peerConRef and do for all viewer. 



import serverConnection from '../../../../CustomHook/serverConnection';


const handleCallEnd = async (peer, authToken, viewerId, liveId,  dispatch) => {
	try {
    const resultData = await serverConnection(
      '/live-stream-viewer-leave',
      { 
        liveId: liveId,
        viewerId: viewerId
      },
      authToken
    );
    //console.log(resultData);

    if (resultData?.status) {
      console.log('remove viewer  from state.');
		/*
      if (peerConRef?.current) {
        peerConRef.current.getSenders().forEach((s) => {
          if (s.track) s.track.stop();
        });
        peerConRef.current.close();
        peerConRef.current = null;
      }*/
    }
  } catch (e) {
    //console.log(e);
  }
};

let endCallTimeout = null; // store timeout globally in module

const attachConnectionStateHandlers = (peer, authToken, viewerId,  dispatch) => {
  if (!peer) return;
	
	peer.onconnectionstatechange = () => {
    const state = peer.connectionState;
    //console.log("PeerConnection state:", state);

    if (state === "connecting") {
      console.log('update viewer connection status to connecting');
    }

    if (state === "connected") {
      console.log('update viewer connection status to connected');
      // if connection is back, clear pending call end
      if (endCallTimeout) {
        clearTimeout(endCallTimeout);
        endCallTimeout = null;
      }
    }
		
		if (state === "failed" || state === "disconnected") {
      console.log('update viewer connection status to fail');
      // Start a 2-minute timeout before ending the call
      if (!endCallTimeout) {
        endCallTimeout = setTimeout(() => {
          handleCallEnd(peer, authToken, viewerId, dispatch);
          endCallTimeout = null;
        }, 2 * 60 * 1000); // 2 minutes
      }
    }

    if (state === "closed") {
      console.log('update viewer connection status to loss or closed');
    }
  };
	
	
	
};


export default attachConnectionStateHandlers;
