import { useCallback, useEffect, useRef } from 'react';

const useUserProfileFollowingsCountUpdateWebsocket = (
	logedUserData,
	userProfileData, 
	setUserProfileData
 ) => {
	
  const logedUserRef = useRef(logedUserData);
  const userProfileRef = useRef(userProfileData);

  // Update refs when props change
  useEffect(() => {
    logedUserRef.current = logedUserData;
  }, [logedUserData]);

  useEffect(() => {
    userProfileRef.current = userProfileData;
  }, [userProfileData]);

  /** 📌 Handle Follow/Unfollow WebSocket Event */
  const handleFollowingsCountUpdate = useCallback((eventData) => {
     if (!eventData || !eventData.updatedProfileFollowingsCount) return;
  
		let followingsCountData = eventData.updatedProfileFollowingsCount;
			//console.log(followingsCountData);
		//check is any profile is selected or fetch, if not then return
		if (!userProfileRef.current ) {
      return;
    }
		
		//check the logged user is same who follow then return
		if (logedUserRef.current?.id ==  followingsCountData.follower_id) {
      return;
    }
	
		
		//check the selected user profile id is same who following the selected user
		if (userProfileRef.current?.id ==  followingsCountData.follower_id) {
      
			setUserProfileData((prevUserProfileData) => ({
					...prevUserProfileData,
					following_count: followingsCountData.selected_user_following_count, 
			}));
    }
		
  }, [setUserProfileData]);

 
 
 
 //websocket event  listener
	 const FollowingsCount_webSocketChannel = `update-user-profile-followings-count`; 
	const FollowingsCount_connectWebSocket = () => {
			window.Echo.channel(FollowingsCount_webSocketChannel)
					.listen('ProfileFollowingsCountUpdate', async (e) => {
							// e.message   
							 
							handleFollowingsCountUpdate(e)
								
					}); 
	};
	
	
	
  useEffect(() => {
 
   FollowingsCount_connectWebSocket(); //call the function for websocket connection 
		 
    return () => {
      window.Echo.leave(FollowingsCount_webSocketChannel);
    };
  }, []);
 
};

export default useUserProfileFollowingsCountUpdateWebsocket;
