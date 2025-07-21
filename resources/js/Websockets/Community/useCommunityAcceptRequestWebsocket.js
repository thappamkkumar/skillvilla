import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
 
import {updateCommunityState as updateJoinedCommunityState} from '../../StoreWrapper/Slice/JoinedCommunitySlice';
 import {updateCommunityState as updateSuggestionCommunityState} from '../../StoreWrapper/Slice/SuggestionCommunitySlice'; 
 import {updateCommunityDetailState} from '../../StoreWrapper/Slice/CommunityDetailSlice'; 
 
const useCommunityAcceptRequestWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityAcceptRequest = useCallback((eventData) => { 
		
		let commmunityRequestAcceptedData = eventData.commmunityRequestAccepted;
	  //console.log(commmunityRequestAcceptedData);
 
		if(logedUserData != null && logedUserData.id == commmunityRequestAcceptedData.user_id)
		{  	 
			return;
		}
		 
		if( logedUserData != null && logedUserData.id == commmunityRequestAcceptedData.member_user_id) 
		{ 
			if(community_id != null && community_id == commmunityRequestAcceptedData.communityData.id)  
			{
				//update has joined status in community detail state
				dispatch(updateCommunityDetailState(
				{
					type: 'updateHasJoined',   hasJoined: true  
				}));
				
				 
			} 
			
			//update has joind status of suggestion community state
			dispatch(updateSuggestionCommunityState({
					type: 'updateHasJoinedStatus',
					updatedHasJoinedData: 
					{ 
						communityId: commmunityRequestAcceptedData.communityData.id,
						hasJoined: true 
					}
			}));
			
			//remove community from joined community state
			dispatch(updateJoinedCommunityState(
			{ 
				type: 'addNewCommunity', 
				communityData: commmunityRequestAcceptedData.communityData 
			}));
		}
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityAcceptRequest_webSocketChannel = `community-request-accepted`; 
	const communityAcceptRequest_connectWebSocket = () => {
			window.Echo.channel(communityAcceptRequest_webSocketChannel)
					.listen('CommunityAcceptRequestEvent', async (e) => {
							// e.message   
							 
							handleCommunityAcceptRequest(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityAcceptRequest_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityAcceptRequest_webSocketChannel);
		};
	}, [  community_id ]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityAcceptRequestWebsocket;
