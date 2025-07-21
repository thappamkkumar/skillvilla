import { useDispatch } from 'react-redux';
import {  useEffect, useCallback, useRef } from 'react'; 
import { updateChatMessageState } from '../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatState } from '../../StoreWrapper/Slice/ChatSlice';

import serverConnection from '../../CustomHook/serverConnection'; 


const useSendNewMessageWebsocket  = (  logedUserData, chatList, authToken, smallScreen, chatId = null, setShowScrollDownBTN) => {
  const dispatch = useDispatch();
	const readStatus = useRef(true);
	
	//function use to call api for update message read status
	const handleUpdateMessageReadStatus = useCallback(async(id)=>{
		try
		{
			let data = await serverConnection(`/update-messsage-read-status`, {id : id}, authToken);
		 //console.log(data);
			if(data.status == false)
			{
			//	consoe.log(data.message);
				readStatus.current = false;
			}
			else
			{
				readStatus.current = true;
			}
		}
		catch(error)
		{
		//	console.log(error);
		}
		
	}, [authToken]);
	
	
	
	// function to fetch  new chat and add in chatlist, if chat is not present in chatList
	const fetchChat = useCallback(async(id)=>{
		try
		{ 
				//call the function fetcg post data fron server
			let data = await serverConnection(`/get-new-chat`, {chat_id : id}, authToken);

			if(data.status == true )
			{													  
				//add new chat in chatlist in redux state 
				dispatch(updateChatState({ type: 'AddNewChat', chat: data.chat }));
				// move chat on top when new message added in redux state 
				dispatch(updateChatState({type : 'updateChatAndMoveToTop',  chatId:id } ));  
							
						 
			} 
		}
		catch(error)
		{
			//console.log(error); 
		}
		
	}, [authToken]);
	
	

	const addNewMessage = useCallback((newMessage)=>{
		
		if(logedUserData != null && logedUserData.id == newMessage.receiver_id)
		{
			const chatIndex = chatList.chatList.findIndex((chat) => chat.id == newMessage.chat_list_id); 
			if (chatIndex === -1)
			{
				 
				//call function to fetch  new chat and add in chatlist, if chat is not present in chatList
				fetchChat(newMessage.chat_list_id);
			}
			else
			{
				if(chatId != null && chatId == newMessage.chat_list_id)
				{ 
					handleUpdateMessageReadStatus(newMessage.id);
					
					//add message in message list 
					dispatch(updateChatMessageState({type : 'AddNewMessage', newMessage:newMessage}));
					//update chat list with is_read as true
					dispatch(updateChatState({type : 'AddNewMessage',  message:{...newMessage, is_read:true} } ));
					
					//it render the scroll to bottom button
					setShowScrollDownBTN(true);
					
				}
				else
				{
					//update chat list with is_read as true
					dispatch(updateChatState({type : 'AddNewMessage',  message:{...newMessage, is_read:false} } ));
				}
				// move chat on top when new message added in redux state 
				dispatch(updateChatState({type : 'updateChatAndMoveToTop',  chatId:newMessage.chat_list_id } ));  
							
			}
			

		}
		
	}, [chatId, logedUserData, chatList]);
 		
		
  //websocket connection for add new message for other user or reciever
		const newMessage_webSocketChannel = `send-message`; 
		const newMessage_connectWebSocket = () => {
				window.Echo.channel(newMessage_webSocketChannel)
						.listen('SendMessageEvent', async (e) => {
								// e.message  
								let newMessage = e.message;  
								  // console.log(newMessage);
								 addNewMessage(newMessage);
						}); 
		};
		useEffect(() => {  
			if(smallScreen == false )
			{ 
				return;
			}
			 newMessage_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(newMessage_webSocketChannel);
			};
		}, [ chatId, chatList,]); // Call the effect only once on component mount

	
	 
 
 
 
		
	 
};

export default useSendNewMessageWebsocket;
