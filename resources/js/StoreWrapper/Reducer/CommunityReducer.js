//reducer for Community List
 
const CommunityReducer = { 
    updateCommunityState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetCommunity": 
							state.communityList = [...state.communityList, ...action.payload.communityList];
						  break;  
					case "addNewCommunity":
					{  
						state.communityList = [ action.payload.communityData, ...state.communityList]; 
						break; 
					}
					
					case "SetCursor":
							state.cursor = action.payload.cursor;
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
					
					case "setScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
					
					case "removeCommunity":
					{ 
						const cummunityIdDelete = action.payload.cummunityId;
						state.communityList = state.communityList.filter(item => item.id != cummunityIdDelete);
						break; 
					}
					
					
					
				case "updateHasJoinedStatus":
					{  
						const { communityId, hasJoined } = action.payload.updatedHasJoinedData;
						state.communityList = state.communityList.map(item =>
								item.id == communityId ? 
								{
									...item, has_joined: hasJoined,
									requests:item.requests && [] 
								} : item
						);
						 
						break; 
					}
				
				case "updateMembersCount":
					{  
						const { communityId, membersCount } = action.payload.updatedMembersCountData;
						state.communityList = state.communityList.map(item =>
								item.id == communityId ? { ...item, members_count: membersCount } : item
						);
						break; 
					}


				case "updatePendingRequestCount":
					{  
						const { communityId, requestCount } = action.payload.updatedPendingRequestCountData;
						state.communityList = state.communityList.map(item =>
								item.id == communityId ? { ...item, pending_requests_count: requestCount } : item
						);
						break; 
					}
					
					
				case "addNewRequest":
					{  
						const addNewRequestData = action.payload.addNewRequestData;
						const communityId  = addNewRequestData.community_id;
						
						state.communityList = state.communityList.map(item =>
								item.id == communityId ? { ...item, requests: [addNewRequestData] } : item
						);
						break; 
					}
					
					
				case "cancelRequest":
					{  
						const cancelRequestCommunityId = action.payload.cancelRequestCommunityId; 
						
						state.communityList = state.communityList.map(item =>
								item.id == cancelRequestCommunityId ? { ...item, requests: [] } : item
						);
						break; 
					}
					
					case "updateImage": 
					{  
						const { communityId, image } = action.payload.updatedCommunityImageData;
						state.communityList = state.communityList.map(item =>
								item.id == communityId ? { ...item, image: image } : item
						);
						break; 
					}					
					case "updateName": 
					{  
						const { communityId, name } = action.payload.updatedCommunityNameData;
						state.communityList = state.communityList.map(item =>
								item.id == communityId ? { ...item, name: name } : item
						);
						break; 
					}					
						 

					default:
							 state.communityList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0; 
							break;
			}
		},
		 
     
}


export default CommunityReducer;