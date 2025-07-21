//reducer 
 
const CommunityRequestReducer = { 
    updateCommunityRequestState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetCommunityRequests":  
							state.requestList = [...state.requestList, ...action.payload.requestList];
						  break;  
					
					case "addNewRequest": 
					 
							state.requestList = [ action.payload.newRequest, ...state.requestList];
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
						
					case "updateRequestStatus":
						const {requestId, status} = action.payload.requestStatusData; 
						state.requestList = state.requestList.map(item =>
								item.id == requestId ? { ...item, status: status } : item
						);
						break;
					
					case "removeRequest":
						const removeRequestId = action.payload.requestId; 
						state.requestList = state.requestList.filter(item => item.id != removeRequestId);
						break;
					
					case "refresh":
							 state.requestList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
							
					default:
						break;
			}
		},
		 
     
}


export default CommunityRequestReducer;