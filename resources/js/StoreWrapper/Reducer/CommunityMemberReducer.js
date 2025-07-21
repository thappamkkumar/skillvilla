//reducer 
 
const CommunityMemberReducer = { 
    updateCommunityMemberState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetCommunityMembers":  
							state.memberList = [...state.memberList, ...action.payload.memberList];
						  break;  
					
					case "SetCommunityOwner":  
							state.communityOwner = action.payload.communityOwner;
						  break;  
					
					case "addNewCommunityMember":  
							state.memberList= [ action.payload.newMember, ...state.memberList];
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
						
						
					/*case "roleUpdation":
						const {memberId, role} = action.payload.roleData; 
						state.memberList = state.memberList.map(item =>
								item.id == memberId ? { ...item, role: role } : item
						);
						break;*/
						
						
					case "contentShareAccessUpdation":
						const {memberId, access} = action.payload.contentShareAccess; 
						state.memberList = state.memberList.map(item =>
								item.id == memberId ? { ...item, can_share_content: access } : item
						);
						break;
					
					case "removeMember":
						const removeMemberId = action.payload.memberId; 
						state.memberList = state.memberList.filter(item => item.id != removeMemberId);
						break;
						
					
					case "refresh":
							 state.memberList = []; 
							 state.communityOwner = null;
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
							
					default:
						break;
			}
		},
		 
     
}


export default CommunityMemberReducer;