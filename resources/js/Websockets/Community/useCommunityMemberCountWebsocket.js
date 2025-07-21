import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateCommunityState as updateYourCommunityState} from '../../StoreWrapper/Slice/YourCommunitySlice';
import {updateCommunityState as updateSuggestionCommunityState} from '../../StoreWrapper/Slice/SuggestionCommunitySlice';
import {updateCommunityState as updateJoinedCommunityState} from '../../StoreWrapper/Slice/JoinedCommunitySlice';
 import {updateCommunityDetailState} from '../../StoreWrapper/Slice/CommunityDetailSlice';
 
 
const useCommunityMemberCountWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityMemberCount = useCallback((eventData) => { 
    let communityMemberCountData = eventData.communityMemberCount;
		 //console.log(communityMemberCountData);
 
		if(logedUserData != null && logedUserData.id == communityMemberCountData.user_id)
		{  	 
			return;
		}
		 
		if(community_id != null && community_id == communityMemberCountData.community_id)
		{
			
			dispatch(updateCommunityDetailState({
				type: 'memberCountUpdate', 
				membersCount : communityMemberCountData.members_count
			}));
			 
		}
		
		dispatch(updateYourCommunityState(
			{ 
				type: 'updateMembersCount', 
				updatedMembersCountData: 
					{ 
						communityId : communityMemberCountData.community_id,
						membersCount : communityMemberCountData.members_count
					} 
			}
		));
					
		dispatch(updateSuggestionCommunityState(
			{ 
				type: 'updateMembersCount', 
				updatedMembersCountData: 
				{ 
					communityId : communityMemberCountData.community_id,
					membersCount : communityMemberCountData.members_count  
				} 
			}
		));
		
		dispatch(updateJoinedCommunityState(
			{ 
				type: 'updateMembersCount', 
				updatedMembersCountData: 
				{
					communityId : communityMemberCountData.community_id,
					membersCount : communityMemberCountData.members_count  
				} 
			}
		));
		  
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityMemberCount_webSocketChannel = `community-member-count`; 
	const communityMemberCount_connectWebSocket = () => {
			window.Echo.channel(communityMemberCount_webSocketChannel)
					.listen('CommunityMemberCountEvent', async (e) => {
							// e.message   
							 
							handleCommunityMemberCount(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityMemberCount_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityMemberCount_webSocketChannel);
		};
	}, [  community_id, logedUserData]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityMemberCountWebsocket;
