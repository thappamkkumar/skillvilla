import serverConnection from '../../../../CustomHook/serverConnection';
 import {updateLiveStreamState} from '../../../../StoreWrapper/Slice/LiveStreamSlice';
 
// create and send by both publisher and viewer.(viewerID is use to filter viewer in publisher side and it is null on viewer side)
const createAndSendICE = async (peer, authToken, toUserId, liveId, viewerId, dispatch) => {
	try {
    let candidateQueue = [];
    let sendTimeout = null;
		const publisherSide = viewerId == null;
		
		peer.onicecandidate = (event) => {
			if (event.candidate) {
        candidateQueue.push(event.candidate);
				
				// Debounce sending so we send in batches every 500ms
        if (!sendTimeout) {
          sendTimeout = setTimeout(async () => {
            const payloadToSend = [...candidateQueue];
            candidateQueue = [];
            sendTimeout = null;
						
						try {
							
							const resultData = await serverConnection(
                '/live-stream-signaling',
                {
                  toUserId: toUserId, //publsher id  or viewer id
                  viewerId: viewerId, //(viewerId is viewer user id use for filter viewer in publisher side)
                  liveId: liveId, 
                  payload: payloadToSend, // Send array of candidates
                  type: 'ice',
                },
                authToken
              );
							//console.log(resultData);
              if (!resultData.status) { 
								console.log('Facing issue while sending ICE.');
								
								if(publisherSide)
								{
									dispatch(updateLiveStreamState(
									{ 
										'type':'updateViewerConnectionStatusAndError',  
										'viewerData': {
												viewerUserId : toUserId,
												isConnecting: false,
												error: 'Facing issue while connecting.',
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
												error: 'Facing issue while connecting.',
											}
										}
									));
								}
							
								
								
								
								
              }
							
						} catch (err) {
							//.log(err); 
							console.log('Something happen wrong. Try again');
							if(publisherSide)
								{
									dispatch(updateLiveStreamState(
									{ 
										'type':'updateViewerConnectionStatusAndError',  
										'viewerData': {
												viewerUserId : toUserId,
												isConnecting: false,
												error: 'Facing issue while connecting.',
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
												error: 'Facing issue while connecting.',
											}
										}
									));
								}
            }
          }, 500);
        }
      }
    };
	} catch (e) {
		//console.log(e);
		console.log('Facing issue while getting ICE.');
		if(publisherSide)
		{
			dispatch(updateLiveStreamState(
			{ 
				'type':'updateViewerConnectionStatusAndError',  
				'viewerData': {
						viewerUserId : toUserId,
						isConnecting: false,
						error: 'Facing issue while connecting.',
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
						error: 'Facing issue while connecting.',
					}
				}
			));
		}
  }

};

export default createAndSendICE;
