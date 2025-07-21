import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
  
 import {updateCommunityState as updateSuggestionCommunityState} from '../../StoreWrapper/Slice/SuggestionCommunitySlice'; 
 import {updateCommunityDetailState} from '../../StoreWrapper/Slice/CommunityDetailSlice'; 
 
const useCommunityRequestRejectedWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityRequestRejected = useCallback((eventData) => { 
		
		let commmunityRequestRejectedData = eventData.commmunityRequestRejected;
	  //console.log(commmunityRequestRejectedData);
 
		if(logedUserData != null && logedUserData.id == commmunityRequestRejectedData.user_id)
		{  	 
			return;
		}
		 
		if( logedUserData != null && logedUserData.id == commmunityRequestRejectedData.request_by_user_id) 
		{  
			if(community_id != null && community_id == commmunityRequestRejectedData.community_id)
			{
				//update has joined status in community detail state
				dispatch(updateCommunityDetailState(
				{
					type: 'addNewRequest', 
					newRequest: 
					{ 
						id: commmunityRequestRejectedData.request_id,
						community_id: commmunityRequestRejectedData.community_id, 
						status: commmunityRequestRejectedData.status, 
					}				
				}));
				
				 
			}
			
			//update has joind status of suggestion community state
			dispatch(updateSuggestionCommunityState({
					type: 'addNewRequest',
					addNewRequestData: 
					{ 
						id: commmunityRequestRejectedData.request_id,
						community_id: commmunityRequestRejectedData.community_id, 
						status: commmunityRequestRejectedData.status, 
					}
			}));
			
		}
	
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityRequestRejected_webSocketChannel = `community-request-rejected`; 
	const communityRequestRejected_connectWebSocket = () => {
			window.Echo.channel(communityRequestRejected_webSocketChannel)
					.listen('CommunityRejectRequestEvent', async (e) => {
							// e.message   
							 
							handleCommunityRequestRejected(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityRequestRejected_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityRequestRejected_webSocketChannel);
		};
	}, [  community_id ]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityRequestRejectedWebsocket;
