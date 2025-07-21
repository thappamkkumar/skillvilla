import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';  
 import {updateCommunityMemberState} from '../../StoreWrapper/Slice/CommunityMemberSlice';

 
const useCommunityJoinedWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityJoined = useCallback((eventData) => { 
    let communityJoinedData = eventData.communityJoined;
		//console.log(communityJoinedData);
 
		if(logedUserData != null && logedUserData.id == communityJoinedData.user_id)
		{  	 
			return;
		}
		
		if(community_id != null && community_id == communityJoinedData.community_id)
		{
			dispatch(updateCommunityMemberState(
			{ 
				type: 'addNewCommunityMember', 
				newMember:  communityJoinedData
			}
		));
		}
		
		  
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityJoined_webSocketChannel = `join-community`; 
	const communityJoined_connectWebSocket = () => {
			window.Echo.channel(communityJoined_webSocketChannel)
					.listen('CommunityJoinEvent', async (e) => {
							// e.message   
							 
							handleCommunityJoined(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityJoined_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityJoined_webSocketChannel);
		};
	}, [  community_id]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityJoinedWebsocket;
