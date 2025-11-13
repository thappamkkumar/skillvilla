//reducer for Active Live List
 
const ActiveLiveReducer = { 
    updateActiveLiveState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetQuickLive": 
							state.quickLiveList = [...state.quickLiveList, ...action.payload.quickLiveList];
						  break;  
					
					case "addNewQuickLive": 
							state.quickLiveList = [ action.payload.newQuickLive, ...state.quickLiveList];
						  break;  
							
					case "SetQuickLiveCursor":
							state.quickLiveCursor = action.payload.quickLiveCursor;
							break;
							
					case "SetQuickLiveHasMore":
							state.quickLiveHasMore = action.payload.quickLiveHasMore;
							break;
							 
					
					
					
					
					
					case "SetProfessionalLive": 
							state.professionalLiveList = [...state.professionalLiveList, ...action.payload.professionalLiveList];
						  break;  
					
					case "addNewProfessionalLive": 
							state.professionalLiveList = [ action.payload.newProfessionalLive, ...state.professionalLiveList];
						  break;  
							
					case "SetProfessionalLiveCursor":
							state.professionalLiveCursor = action.payload.professionalLiveCursor;
							break;
							
					case "SetProfessionalLiveHasMore":
							state.professionalLiveHasMore = action.payload.professionalLiveHasMore;
							break;
					 
 
						
					case "setScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
					
						case "refresh":
							 state.postList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
					default: 
							break;
			}
		},
		 
     
}


export default ActiveLiveReducer;