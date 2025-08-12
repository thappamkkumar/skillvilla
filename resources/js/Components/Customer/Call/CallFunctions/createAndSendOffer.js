import serverConnection from '../../../../CustomHook/serverConnection';
import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';

const createAndSendOffer = async ( peerConRef, authToken, chatCallData, dispatch) => {
	 
	
	try
	{
		
		// create the offer
		const offer = await peerConRef.current.createOffer();
		await peerConRef.current.setLocalDescription(offer);
	
		const resultData = await serverConnection('/call/signal', 
											{ 
												toUserId: chatCallData.receiver.id,
												call_id: chatCallData.callId,
												payload: offer,
												type: 'offer',
											}, authToken   ); 
		//console.log(resultData);
		 
		if(!resultData.status)
		{
			dispatch(updateChatCallState({'type' : 'setError', 'error': 'Face issue while connecting.' } )); 
		}
	
	}
	catch(e)
	{
		//console.log(e);
		dispatch(updateChatCallState({'type' : 'setError', 'error': 'Face issue while connecting.' } )); 
	}
	
};

export default createAndSendOffer;
