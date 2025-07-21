//reducer for Share Stats 
 
const ShareStatsReducer = { 
    updateShareStatsState(state, action)
    {  
			switch (action.payload.type)
			{
					
					case "SetSelectedId":
						state.selectedId = action.payload.selectedId;
						break;
						
					case "SetSelectedFeature":
						state.selectedFeature = action.payload.selectedFeature;
						break;
						
						
						
					case "SetUserList":
					{
						const append = action.payload.append;
						if(append)
						{
							state.userList = [...state.userList, ...action.payload.userList];
						}
						else
						{
							state.userList = action.payload.userList;
						}
						
						break;
					}
					
					case "SetUserCursor":
							state.userCursor = action.payload.userCursor;
							break;	
							
					case "SetUserHasMore":
							state.userHasMore = action.payload.userHasMore;
							break;	
						
						
						
					case "SetCommunityList":
					{
						const append = action.payload.append;
						if(append)
						{
							state.communityList = [...state.communityList, ...action.payload.communityList];
						}
						else
						{
							state.communityList = action.payload.communityList;
						}
						
						break;
					}
					 
					
					case "SetCommunityCursor":
							state.communityCursor = action.payload.communityCursor;
							break;	
							
					case "SetCommunityHasMore":
							state.communityHasMore = action.payload.communityHasMore;
							break;	
						
						 
					case "refresh": {
						state.selectedId = null;
						state.selectedFeature = "";
						
						state.userList = []; 
						state.userCursor = null; 
						state.userHasMore = false;
						
						state.communityList = []; 
						state.communityCursor = null; 
						state.communityHasMore = false;
						break;
					}
					
					default: 
						break;
							
			}
		},
		 
     
}


export default ShareStatsReducer;