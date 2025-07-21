import { useCallback, useEffect, useRef } from 'react';

const useUserProfileFollowersCountUpdateWebsocket = (
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
  const handleFollowersCountUpdate = useCallback((eventData) => {
     if (!eventData || !eventData.updatedProfileFollowersCount) return;
  
		let followersCountData = eventData.updatedProfileFollowersCount;
		//console.log(followersCountData);
		
		//check is any profile is selected or fetch, if not then return
		if (!userProfileRef.current ) {
      return;
    }
		
		//check the logged user is same who follow then return
		if (logedUserRef.current?.id ==  followersCountData.follower_id) {
      return;
    }
		
		//check the selected user profile id is same who followed by   user
		if (userProfileRef.current?.id ==  followersCountData.following_id) {
      
			setUserProfileData((prevUserProfileData) => ({
					...prevUserProfileData,
					followers_count: followersCountData.followers_count, 
			}));
    }
		
  }, [setUserProfileData]);

 
 
 
 //websocket event  listener
	 const FollowersCount_webSocketChannel = `update-user-profile-followers-count`; 
	const FollowersCount_connectWebSocket = () => {
			window.Echo.channel(FollowersCount_webSocketChannel)
					.listen('ProfileFollowersCountUpdate', async (e) => {
							// e.message   
							 
							handleFollowersCountUpdate(e)
								
					}); 
	};
	
	
	
  useEffect(() => { 
   FollowersCount_connectWebSocket(); //call the function for websocket connection 
		 
    return () => {
      window.Echo.leave(FollowersCount_webSocketChannel);
    };
  }, []);
 
};

export default useUserProfileFollowersCountUpdateWebsocket;
