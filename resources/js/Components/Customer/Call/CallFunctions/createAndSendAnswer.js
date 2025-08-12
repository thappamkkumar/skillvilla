import serverConnection from '../../../../CustomHook/serverConnection';
import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';

const createAndSendAnswer = async ( peerConRef, authToken, chatCallData, dispatch) => { 
	
	try
	{
		
		// create the answer
		const answer = await peerConRef.current.createAnswer();
		await peerConRef.current.setLocalDescription(answer);
		 
		const resultData = await serverConnection('/call/signal', 
											{ 
												toUserId: chatCallData.caller.id,
												call_id: chatCallData.callId,
												payload: answer,
												type: 'answer',
											}, authToken   ); 
											
		//console.log(resultData);
		if(!resultData.status)
		{
			dispatch(updateChatCallState({'type' : 'setError', 'error': 'Face issue while connecting.' } )); 
		}
	
	}
	catch(e)
	{
		console.log(e);
		dispatch(updateChatCallState({'type' : 'setError', 'error': 'Face issue while connecting.' } )); 
	}
	
};

export default createAndSendAnswer;
