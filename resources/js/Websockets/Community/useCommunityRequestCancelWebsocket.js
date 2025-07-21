import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
 
//import {updateCommunityState as updateJoinedCommunityState} from '../../StoreWrapper/Slice/JoinedCommunitySlice';
 import {updateCommunityState as updateSuggestionCommunityState} from '../../StoreWrapper/Slice/SuggestionCommunitySlice'; 
 import {updateCommunityDetailState} from '../../StoreWrapper/Slice/CommunityDetailSlice'; 
 
const useCommunityRequestCancelWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityRequestCancel = useCallback((eventData) => { 
		
		let communityRequestCancelData = eventData.communityRequestCancel;
	   console.log(communityRequestCancelData);
 
		if(logedUserData != null && logedUserData.id == communityRequestCancelData.user_id)
		{  	 
			return;
		}
		 
		if( logedUserData != null && logedUserData.id == communityRequestCancelData.request_by_user_id) 
		{ 
			if(community_id != null && community_id == communityRequestCancelData.community_id)  
			{
				//update has joined status in community detail state
				dispatch(updateCommunityDetailState(
				{
					type: 'cancelRequest',  
				}));
				
				 
			} 
			
			//update has joind status of suggestion community state
			dispatch(updateSuggestionCommunityState({
					type: 'cancelRequest',
					cancelRequestCommunityId: communityRequestCancelData.community_id,
						
			}));
			 
		}
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityRequestCancel_webSocketChannel = `community-request-cancel`; 
	const communityRequestCancel_connectWebSocket = () => {
			window.Echo.channel(communityRequestCancel_webSocketChannel)
					.listen('CommunityRequestCancelEvent', async (e) => {
							// e.message   
							 
							handleCommunityRequestCancel(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityRequestCancel_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityRequestCancel_webSocketChannel);
		};
	}, [  community_id ]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityRequestCancelWebsocket;
