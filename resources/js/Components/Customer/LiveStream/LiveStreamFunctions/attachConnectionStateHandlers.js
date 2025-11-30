



import serverConnection from '../../../../CustomHook/serverConnection';
import {updateLiveStreamState} from '../../../../StoreWrapper/Slice/LiveStreamSlice';
 
 

// store individual disconnect timers per viewer
const disconnectTimers = {};

 
const handleViewerLeave = async (peerConRef,  authToken, viewerId, liveId,  dispatch, isPublisherSide) => {
	try {
    const resultData = await serverConnection(
      '/live-stream-viewer-leave',
      { 
        liveId: liveId,
        viewerId: viewerId
      },
      authToken
    );
   // console.log(resultData);
 
			
			if(isPublisherSide)
			{ 
				const liveData = {
						liveId:  liveId,
						viewerUserId:  viewerId,
					};
				if (peerConRef?.current && peerConRef.current[viewerId]) 
				{
					
					const peer = peerConRef.current[viewerId]; 
          peer.close();
 
          delete peerConRef.current[viewerId];
					 
				}
				dispatch(updateLiveStreamState({type : 'removeViewer', liveData: liveData}));
				

			}
			else
			{ 
				if (peerConRef?.current) 
				{
					peerConRef.current.getSenders().forEach((s) => {
						if (s.track) s.track.stop();
					});
					peerConRef.current.close();
					peerConRef.current = null;
				}
				dispatch(updateLiveStreamState({type : 'refresh'}));
			}
		
       
  } catch (e) {
    console.log(e);
  }
};



 

const attachConnectionStateHandlers = (peerConRef, peer, authToken, viewerId,liveId,  dispatch, isPublisherSide) => {
  if (!peer) return;
	
	peer.onconnectionstatechange = () => {
    const state = peer.connectionState;
    //console.log("PeerConnection state:", state);

    if (state === "connecting") { 
			if(isPublisherSide)
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateViewerConnectionStatusAndError',  
					'viewerData': {
							viewerUserId : viewerId,
							isConnecting: true,
							error: null,
						}
					}
				));
			}
			else
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateCurrentViewerConnectionStatusAndError',  
					'currentViewerData': {
							viewerId : viewerId,
							isConnecting: true,
							error: null,
						}
					}
				));
			}
    }

    if (state === "connected") {
      if(isPublisherSide)
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateViewerConnectionStatusAndError',  
					'viewerData': {
							viewerUserId : viewerId,
							isConnecting: false,
							error: null,
						}
					}
				));
			}
			else
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateCurrentViewerConnectionStatusAndError',  
					'currentViewerData': {
							viewerId : viewerId,
							isConnecting: false,
							error: null,
						}
					}
				));
			}
			
			
			
      // if connection is back, clear pending call end
      if (disconnectTimers[viewerId]) {
        clearTimeout(disconnectTimers[viewerId]);
        delete disconnectTimers[viewerId];
      }
    }
		
		if (state === "failed" || state === "disconnected") {
       
			if(isPublisherSide)
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateViewerConnectionStatusAndError',  
					'viewerData': {
							viewerUserId : viewerId,
							isConnecting: false,
							error: "Connection interrupted. Reconnecting...",
						}
					}
				));
			}
			else
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateCurrentViewerConnectionStatusAndError',  
					'currentViewerData': {
							viewerId : viewerId,
							isConnecting: false,
							error: "Connection interrupted. Reconnecting...",
						}
					}
				));
			}
			
			
      // Start a 2-minute timeout before ending the call
      if (!disconnectTimers[viewerId]) {
        disconnectTimers[viewerId] = setTimeout(() => {
					
          handleViewerLeave(peerConRef, authToken, viewerId, liveId, dispatch, isPublisherSide);
          
					delete disconnectTimers[viewerId];
        }, 2 * 60 * 1000); // 2 minutes
      }
    }

    if (state === "closed") {
       
			if(isPublisherSide)
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateViewerConnectionStatusAndError',  
					'viewerData': {
							viewerUserId : viewerId,
							isConnecting: false,
							error: 'Connection closed.',
						}
					}
				));
			}
			else
			{
				dispatch(updateLiveStreamState(
				{ 
					'type':'updateCurrentViewerConnectionStatusAndError',  
					'currentViewerData': {
							viewerId : viewerId,
							isConnecting: false,
							error: 'Connection closed.',
						}
					}
				));
			}
			
			
			
			if (disconnectTimers[viewerId]) 
			{
				clearTimeout(disconnectTimers[viewerId]);
				delete disconnectTimers[viewerId];
			}
			
    }
  };
	
	
	
};


export default attachConnectionStateHandlers;
