import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateCommunityRequestState } from '../../StoreWrapper/Slice/CommunityRequestSlice'; 
 
const useCommunityJoinedRequestCancelWebsocket = (
	logedUserData, 
	community_id = null, 
	
 ) =>
{
  const dispatch = useDispatch();

 

    
  const handleCommunityJoinedRequestCancel = useCallback((eventData) => { 
    let communityCancelRequestData = eventData.communityJoinedRequestCancel;
		
		//console.log(communityCancelRequestData);
 
		if(logedUserData != null && logedUserData.id == communityCancelRequestData.user_id)
		{  	 
			return
		}
		
		if(community_id != null && community_id == communityCancelRequestData.community_id)
		{
			dispatch(updateCommunityRequestState(
				{ 
					type: 'removeRequest', 
					requestId: communityCancelRequestData.request_id
				}
			)); 
						 
		}
		
	 
						
						
		 
		  
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityCancelRequest_webSocketChannel = `cancel-community-join-request`; 
	const communityCancelRequest_connectWebSocket = () => {
			window.Echo.channel(communityCancelRequest_webSocketChannel)
					.listen('CommunityJoinedRequestCancelEvent', async (e) => {
							// e.message   
						 	handleCommunityJoinedRequestCancel(e);
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityCancelRequest_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityCancelRequest_webSocketChannel);
		};
	}, [   community_id]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityJoinedRequestCancelWebsocket;
