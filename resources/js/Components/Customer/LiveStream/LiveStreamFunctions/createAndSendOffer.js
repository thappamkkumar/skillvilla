import serverConnection from '../../../../CustomHook/serverConnection';
 
const createAndSendOffer = async ( peer, authToken, toUserId, liveId) => {
	 
	
	try
	{
		
		// create the offer
		const offer = await peer.createOffer();
		await peer.setLocalDescription(offer);
	
		const resultData = await serverConnection('/live-stream-signaling', 
											{ 
												toUserId: toUserId,
												liveId: liveId,
												payload: offer,
												type: 'offer',
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

export default createAndSendOffer;
