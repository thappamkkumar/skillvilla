import serverConnection from '../../../../CustomHook/serverConnection';

const createAndSendAnswer = async ( peer, authToken, toUserId, liveId, viewerId) => { 
	
	try
	{
		
		// create the answer (create and send by viewer )
		const answer = await peer.createAnswer();
		await peer.setLocalDescription(answer);
		 
		const resultData = await serverConnection('/live-stream-signaling', 
											{ 
												toUserId: toUserId,
												viewerId: viewerId,//(viewerId is logged user id use for filter viewer in publisher side)
												liveId: liveId,
												payload: answer,
												type: 'answer',
											}, authToken   ); 
											
		//console.log(resultData);
		if(!resultData.status)
		{ 
			console.log('send error to viewer and cancel conneting');
		}
	
	}
	catch(e)
	{
		console.log(e);
		console.log('send error to viewer and cancel conneting');
	}
	
};

export default createAndSendAnswer;
