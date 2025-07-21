//reducer for Chat List
 
const ChatMessageReducer = { 
    updateChatMessageState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetChatMessage":  
							const groupedMessages = action.payload.messageList;
							const updatedChat = { ...state.messageList };
 
							// Loop through each group and append new messages
							Object.keys(groupedMessages).forEach((date) => {
								if (updatedChat[date]) {
									updatedChat[date] = [...groupedMessages[date].reverse(), ...updatedChat[date]];
								} else {
									updatedChat[date] = groupedMessages[date].reverse();
								}
							});

           
							state.messageList = updatedChat;
						  break;  
					
					
					case "AddNewMessage":
						const newMessage = action.payload.newMessage;
						 // Clone the existing message list to avoid direct mutation
            const updatedMessages = { ...state.messageList };
						// Check if the group already exists and add the new message
						 
								// For other dates, use the actual date
								if (!updatedMessages[newMessage.created_at]) {
										updatedMessages[newMessage.created_at] = [];
								}
								updatedMessages[newMessage.created_at].push(newMessage);
						 
						 state.messageList = updatedMessages;
						break;
					 
					 
					 
					 
					 
					case "UpdateReadStatus":
						//data about readed messages
						const readedData = action.payload.readedData.updatedMsgData;
						const loggedUserId = action.payload.readedData.loggedUserId;
						// Clone the existing message list to avoid direct mutation
            const cloneMessages =   { ...state.messageList };
					
					// Loop through each group  messages
						Object.keys(readedData).forEach((date) => 
						{  
								if (cloneMessages[date]) 
								{
									cloneMessages[date].forEach((message, i) => 
									{ 
										// Find the message with the same id in readedData[date]
										const readMessage = readedData[date].find(
										(readMsg) => readMsg.id === message.id && loggedUserId != null && loggedUserId == message.sender_id
										);
                
										if (readMessage)
										{
											 
											cloneMessages[date][i].is_read = true;
										}
									 
									}); 
									  
								} 
						});
						
					 
						break;
						
						
						
						
					
					case "SetChatUser":
							state.chatUser = action.payload.chatUser;
							break;
					
					case "SetCursor":
							state.cursor = action.payload.cursor;
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
					  
					 
					
					case "SetScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
					
					case "SetScrollHeight": 
						state.scrollHeight = action.payload.scrollHeight;
						break;
						
					
					
					
					case "refresh":
							 state.messageList = {}; 
							 state.chatUser = null;
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							 state.scrollHeight = 0;
							break;
							
					default:
							break;
			}
		},
		 
     
}

 
export default ChatMessageReducer;