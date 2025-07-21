import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';  
 import {updateCommunityMemberState} from '../../StoreWrapper/Slice/CommunityMemberSlice';

 
const useCommunityLeavedWebsocket = (
	logedUserData, 
	community_id = null,  
)=>
{
 
	const dispatch = useDispatch();
 
    
  const handleCommunityLeaved = useCallback((eventData) => { 
    let communityLeavedData = eventData.communityLeaved;
	 //console.log(communityLeavedData);
 
		if(logedUserData != null && logedUserData.id == communityLeavedData.user_id)
		{  	 
			return;
		}
		
		if(community_id != null && community_id == communityLeavedData.community_id)
		{
			dispatch(updateCommunityMemberState(
			{ 
				type: 'removeMember', 
				memberId:  communityLeavedData.member_id
			}
		));
		}
		
		  
		 
							  
  }, [dispatch, logedUserData,  community_id]);






//websocket event  listener
	const communityLeaved_webSocketChannel = `leave-community`; 
	const communityLeaved_connectWebSocket = () => {
			window.Echo.channel(communityLeaved_webSocketChannel)
					.listen('CommunityLeaveEvent', async (e) => {
							// e.message   
							 
							handleCommunityLeaved(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		communityLeaved_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(communityLeaved_webSocketChannel);
		};
	}, [  community_id]); // Call the effect only once on component mount
  
		
	 
};

export default useCommunityLeavedWebsocket;
