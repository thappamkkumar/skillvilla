import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
 
import {updateCommunityState as updateJoinedCommunityState} from '../../StoreWrapper/Slice/JoinedCommunitySlice';
 import {updateCommunityState as updateSuggestionCommunityState} from '../../StoreWrapper/Slice/SuggestionCommunitySlice'; 
 import {updateCommunityDetailState} from '../../StoreWrapper/Slice/CommunityDetailSlice';
 import {updateCommunityMemberState} from '../../StoreWrapper/Slice/CommunityMemberSlice';
 
const useCommunityRemoveMemberWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityRemoveMember = useCallback((eventData) => { 
		
		let commmunityRemovedMemberData = eventData.commmunityRemovedMember;
	 //console.log(communityRequestCountData);
 
		if(logedUserData != null && logedUserData.id == commmunityRemovedMemberData.user_id)
		{  	 
			return;
		}
		 
		 
		if(community_id != null && community_id == commmunityRemovedMemberData.community_id)
		{
			
			if(logedUserData != null && logedUserData.id == commmunityRemovedMemberData.member_user_id)
			{
				//update has joined status in community detail state
				dispatch(updateCommunityDetailState(
				{
					type: 'updateHasJoined',   hasJoined: false  
				}));
			}
			
			//remove member from member list
			dispatch(updateCommunityMemberState(
			{
				type: 'removeMember',
				memberId: commmunityRemovedMemberData.member_id
			}));
		}
		
		
		if(logedUserData != null && logedUserData.id == commmunityRemovedMemberData.member_user_id)
		{
			//update has joind status of suggestion community state
			dispatch(updateSuggestionCommunityState({
					type: 'updateHasJoinedStatus',
					updatedHasJoinedData: 
					{ 
						communityId: commmunityRemovedMemberData.community_id,
						hasJoined: false 
					}
			}));
			
			//remove community from joined community state
			dispatch(updateJoinedCommunityState(
			{ 
				type: 'removeCommunity', 
				cummunityId: commmunityRemovedMemberData.community_id,
			}));
		}
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityRemoveMember_webSocketChannel = `remove-community-member`; 
	const communityRemoveMember_connectWebSocket = () => {
			window.Echo.channel(communityRemoveMember_webSocketChannel)
					.listen('CommunityRemoveMemberEvent', async (e) => {
							// e.message   
							 
							handleCommunityRemoveMember(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityRemoveMember_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityRemoveMember_webSocketChannel);
		};
	}, [  community_id, logedUserData ]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityRemoveMemberWebsocket;
