//reducer 
 
const CommunityMessageReducer = { 
    updateCommunityMessageState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetCommunityMessage":  
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
					 
					 
					  
						case "SetCommunityData":
							state.communityData = action.payload.communityData;
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
							 state.communityData = null;
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

 
export default CommunityMessageReducer;