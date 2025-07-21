import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateCommunityState as updateYourCommunityState} from '../../StoreWrapper/Slice/YourCommunitySlice'; 
 import {updateCommunityDetailState} from '../../StoreWrapper/Slice/CommunityDetailSlice';
 
 
const useCommunityRequestCountWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityRequestCount = useCallback((eventData) => { 
		
		let communityRequestCountData = eventData.communityRequestCount;
		//console.log(communityRequestCountData);
 
		if(logedUserData != null && logedUserData.id == communityRequestCountData.user_id)
		{  	 
			return;
		}
		 
		 
		if(community_id != null && community_id == communityRequestCountData.community_id)
		{
			dispatch(updateCommunityDetailState(
			{
				type: 'requestCountUpdate', 
				requestCount: communityRequestCountData.requests_count
			})); 
		}
		
		
		dispatch(updateYourCommunityState(
		{
				type: 'updatePendingRequestCount',
				updatedPendingRequestCountData: { 
					communityId: communityRequestCountData.community_id,
					requestCount: communityRequestCountData.pending_requests_count
				}
		}));
	  
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityRequestCount_webSocketChannel = `community-request-count`; 
	const communityRequestCount_connectWebSocket = () => {
			window.Echo.channel(communityRequestCount_webSocketChannel)
					.listen('CommunityRequestCountEvent', async (e) => {
							// e.message   
							 
							handleCommunityRequestCount(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityRequestCount_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityRequestCount_webSocketChannel);
		};
	}, [  community_id, logedUserData ]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityRequestCountWebsocket;
