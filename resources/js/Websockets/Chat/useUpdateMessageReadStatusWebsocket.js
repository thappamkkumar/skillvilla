import { useDispatch } from 'react-redux';
import {  useEffect } from 'react'; 
import { updateChatMessageState } from '../../StoreWrapper/Slice/ChatMessageSlice';

const useUpdateMessageReadStatusWebsocket  = ( chatId = null, logedUserData) => {
  const dispatch = useDispatch();

 		
 
  //websocket connection for update message read status
	const updateMessageReadStatus_webSocketChannel = `update-message-read-status`; 
	const updateMessageReadStatus_connectWebSocket = () => {
			window.Echo.channel(updateMessageReadStatus_webSocketChannel)
					.listen('UpdateMessageReadStatusEvent', async (e) => {
							// e.message  
							let readMessages = e.message;
							//console.log(readMessages);
							if(logedUserData == null)return;
								 
							if(chatId != null && chatId == readMessages.chat_id)
							{								
								 
								const readedData = {
									loggedUserId :logedUserData.id,
									updatedMsgData :readMessages.updatedData,
								}
								dispatch(updateChatMessageState({ type: 'UpdateReadStatus', readedData: readedData }));
					
							}
						
					}); 
	};
		
	useEffect(() => {  
		 updateMessageReadStatus_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(updateMessageReadStatus_webSocketChannel);
		};
	}, [chatId]);
	
	 
 
 
 
		
	 
};

export default useUpdateMessageReadStatusWebsocket;
