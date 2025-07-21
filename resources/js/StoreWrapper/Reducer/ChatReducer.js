//reducer for Chat List
 
const ChatReducer = { 
    updateChatState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetChat": 
							state.chatList = [...state.chatList, ...action.payload.chatList];
						  break;  
					 
					case "SetCursor":
							state.cursor = action.payload.cursor;
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
					
					case "UpdateLatestMessageReadStatus":
					{
						/*const updatedChatList = state.chatList.map(chat => {
							if (chat.id == action.payload.updateChat.chatId && (chat.latest_message != null && chat.latest_message.id <= action.payload.updateChat.messageId)) {
								return {
									...chat,
									latest_message: {
										...chat.latest_message,
										is_read: true // Update is_read to true
									}
								};
							}
							return chat; // Return chat as is if no match
						});
					
						state.chatList = updatedChatList;*/
						
						const updatedChatList = state.chatList.map(chat => {
							if (chat.id == action.payload.chatId)
							{
								return {
									...chat,
									latest_message: {
										...chat.latest_message,
										is_read: true // Update is_read to true
									}
								};
							}
							return chat; // Return chat as is if no match
						});
						 
						state.chatList = updatedChatList;
						break;
					}
					
					case "AddNewMessage":
					{
						 
						 
						const updatedChatList = state.chatList.map(chat => {
							if (chat.id == action.payload.message.chat_list_id )
							{
								return {
									...chat,
									latest_message:	action.payload.message,
								};
							}
							return chat; // Return chat as is if no match
						});
						state.chatList = updatedChatList;
						break;
					}
					case "AddNewChat":
					{
						// Find the index  
						const chatIndex = state.chatList.findIndex((chat) => chat.id == action.payload.chat.id);
						if (chatIndex === -1)
						{
							 
							state.chatList =  [action.payload.chat,...state.chatList];
						}
						break;
					}
					
					case "SetScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
					
					case "updateChatAndMoveToTop" :
					{
						const chatId   = action.payload.chatId;
 
						// Find the index and update
						const chatIndex = state.chatList.findIndex((chat) => chat.id == chatId);
						if (chatIndex !== -1)
						{ 
							const updatedChat = {
							...state.chatList[chatIndex],
								updated_at: new Date().toISOString(),
							};
							
							// Create a new chat list where the updated chat is at the top
								const newChatList = [
									updatedChat,
									...state.chatList.filter((chat, index) => index !== chatIndex), // Remove the old chat
								];
							state.chatList = newChatList;
						}

						
						break;	 
					}
					
					 
					case "chatDeleted": {
							const chatIdToDelete = action.payload.chat_id;
							state.chatList = state.chatList.filter(chat => chat.id != chatIdToDelete);
							break;
					}
					
					case "refresh": {
						state.chatList = []; 
						state.cursor = null;
						state.hasMore = false;
						state.scrollHeightPosition = 0; 
						break;
					}
					
					default: 
						break;
							
			}
		},
		 
     
}


export default ChatReducer;