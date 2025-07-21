import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateCommunityRequestState} from '../../StoreWrapper/Slice/CommunityRequestSlice'; 
 
const useCommunitySendRequestWebsocket = (
	logedUserData, 
	community_id = null, 
	
 ) =>
{
  const dispatch = useDispatch();

 

    
  const handleCommunityNewRequest = useCallback((eventData) => { 
    let communityNewRequestData = eventData.communityNewRequest;
		 //console.log(communityNewRequestData);
 
		if(logedUserData != null && logedUserData.id == communityNewRequestData.request_by_user_id)
		{  	 
			return
		}
		
		if(community_id != null && community_id == communityNewRequestData.community_id)
		{
			dispatch(updateCommunityRequestState(
				{ 
					type: 'addNewRequest', 
					newRequest: communityNewRequestData
				}
			)); 
						
		}
		
	 
						
		 
		  
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityNewRequest_webSocketChannel = `community-send-new-request`; 
	const communityNewRequest_connectWebSocket = () => {
			window.Echo.channel(communityNewRequest_webSocketChannel)
					.listen('CommunitySendRequestEvent', async (e) => {
							// e.message   
						 	handleCommunityNewRequest(e);
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityNewRequest_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityNewRequest_webSocketChannel);
		};
	}, [ community_id]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunitySendRequestWebsocket;
