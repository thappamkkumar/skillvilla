import serverConnection from '../../../../CustomHook/serverConnection';
import {updateLiveStreamState} from '../../../../StoreWrapper/Slice/LiveStreamSlice';

const createAndSendOffer = async ( peer, authToken, toUserId, liveId, dispatch) => {
	 
	
	try
	{
		
		// create the offer (create and send by publisher)
		const offer = await peer.createOffer();
		await peer.setLocalDescription(offer);
	
		const resultData = await serverConnection('/live-stream-signaling', 
											{ 
												toUserId: toUserId,//viewer user id
												liveId: liveId,
												payload: offer,
												type: 'offer',
											}, authToken   ); 
		//console.log(resultData);
		 
		if(!resultData.status)
		{
			console.log('Facing issue while sending offer to viewer.');
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
	
	}
	catch(e)
	{
		//console.log(e);
		console.log('Facing issue while creating offer.');
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
	
};

export default createAndSendOffer;
