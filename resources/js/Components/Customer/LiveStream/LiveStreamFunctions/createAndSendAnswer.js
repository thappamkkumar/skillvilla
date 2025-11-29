import serverConnection from '../../../../CustomHook/serverConnection';
import {updateLiveStreamState} from '../../../../StoreWrapper/Slice/LiveStreamSlice';

const createAndSendAnswer = async ( peer, authToken, toUserId, liveId, viewerId, dispatch) => { 
	
	try
	{
		
		// create the answer (create and send by viewer )
		const answer = await peer.createAnswer();
		await peer.setLocalDescription(answer);
		 
		const resultData = await serverConnection('/live-stream-signaling', 
											{ 
												toUserId: toUserId,//it is publisher id
												viewerId: viewerId,//(viewerId is logged user id use for filter viewer in publisher side)
												liveId: liveId,
												payload: answer,
												type: 'answer',
											}, authToken   ); 
											
		//console.log(resultData);
		if(!resultData.status)
		{ 
			console.log('Facing issue while sending answer to publisher.');
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
	catch(e)
	{
		//console.log(e);
		console.log('Facing issue while creating answer.');
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
	
};

export default createAndSendAnswer;
