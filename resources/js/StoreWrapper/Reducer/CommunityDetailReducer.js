 
const CommunityDetailReducer = { 
    updateCommunityDetailState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					 
					
				
					case "SetCommunityDetail":
							state.communityDetail = action.payload.communityDetail;
							break;
					
				 
					case "updateHasJoined":
						{
							if (state.communityDetail?.hasOwnProperty('has_joined')) {
                    state.communityDetail.has_joined = action.payload.hasJoined;
                }
							if (state.communityDetail?.hasOwnProperty('requests')) {
                    state.communityDetail.requests = [];
                }
							break;
						}
							
					
					case "cancelRequest":
							if (state.communityDetail?.hasOwnProperty('requests')) {
                    state.communityDetail.requests = [];
                }
							break;
							
							
					case "addNewRequest":
							if (state.communityDetail?.hasOwnProperty('requests')) {
                    state.communityDetail.requests = [action.payload.newRequest];
                }
							break;
					 
					case "setScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
						
					case "memberCountUpdate":  
						if (state.communityDetail?.hasOwnProperty('members_count')) {
                    state.communityDetail.members_count = action.payload.membersCount;
                }
						break;
					
					case "requestCountUpdate":  
						if (state.communityDetail?.hasOwnProperty('requests_count')) {
                    state.communityDetail.requests_count = action.payload.requestCount;
                }
						break;
					
					case "updateImage":  
						if (state.communityDetail?.hasOwnProperty('image')) {
                    state.communityDetail.image = action.payload.image;
                }
						break;
						
					case "updateCommunity":  
						const { name, privacy, content_share_access, description } = action.payload.updatedCommunity;

						if (name !== undefined) state.communityDetail.name = name;
						if (privacy !== undefined) state.communityDetail.privacy = privacy;
						if (content_share_access !== undefined) state.communityDetail.content_share_access = content_share_access;
						if (description !== undefined) state.communityDetail.description = description;

						break;

					
					case "refresh":
						state.communityDetail = null; 
						state.scrollHeightPosition = 0;
						break;
					 

					default:
							  
							break;
			}
		},
		 
     
}


export default CommunityDetailReducer;