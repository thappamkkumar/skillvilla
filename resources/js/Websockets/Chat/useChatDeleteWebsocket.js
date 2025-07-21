import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';    
 import { updateChatMessageState } from '../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatState } from '../../StoreWrapper/Slice/ChatSlice';

const useChatDeleteWebsocket = (
logedUserData,
smallScreen,
chat_id = null, 

) => {
  const dispatch = useDispatch();
 
 
 // Function to handle chat deletion
  const handleChatDeleted = useCallback((eventData) => {
		const deletedChatData = eventData.chatDelete;

		if (logedUserData != null && deletedChatData.user_id == logedUserData.id) 
		{ 
			return;
		} 
 

		if(chat_id != null && deletedChatData.chat_id == chat_id)
		{ 
			dispatch(updateChatMessageState({type : 'refresh'})); 
		}

		dispatch(updateChatState({type : 'chatDeleted', chat_id: deletedChatData.chat_id}));
	 
  }, [dispatch, logedUserData, chat_id]);
	
	
	
	
	//websocket connection for job deletion
		const chatDelete_webSocketChannel = `chat-delete`; 
		const chatDelete_connectWebSocket = () => {
				window.Echo.channel(chatDelete_webSocketChannel)
						.listen('ChatDeleteEvent', async (e) => {
								// e.message   
								   //console.log(e);
								handleChatDeleted(e)
								  
						}); 
		};
		useEffect(() => {  
			if(smallScreen == false )
			{ 
				return;
			}  
			 chatDelete_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(chatDelete_webSocketChannel);
			};
		}, [   chat_id]); // Call the effect only once on component mount
		
};

export default useChatDeleteWebsocket;
