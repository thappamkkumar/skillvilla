 
import { useCallback, useEffect, useRef} from 'react';
  

const useUserProfileUpdateWebsocket = (
	logedUserData, 
	userProfileData,  
	setUserProfileData,  
)=>
{
	const logedUserRef = useRef(logedUserData);
	const userProfileRef = useRef(userProfileData);

// Update the refs whenever the props change
  useEffect(() => {
    logedUserRef.current = logedUserData;
  }, [logedUserData]);

  useEffect(() => {
    userProfileRef.current = userProfileData;
  }, [userProfileData]);
	 
    
  const handleUserProfileUpdate = useCallback((eventData) => { 
		
		if (!eventData || !eventData.updatedProfileData) return;

    let updatedProfileData = eventData.updatedProfileData;
    

    if (!userProfileRef.current ) {
      return;
    }
		if (logedUserRef.current?.id ==  updatedProfileData.user_id) {
      return;
    }
    if (updatedProfileData.user_id !=  userProfileRef.current.id) return;

	 
		// Map of profile fields to update
    const updateFields = {
      image: (prev) => ({
        ...prev,
        customer: prev.customer
          ? { ...prev.customer, image: `${updatedProfileData.val}?timestamp=${Date.now()}` }
          : prev.customer,
      }),
      name: (prev) => ({ ...prev, name: updatedProfileData.val }),
      userID: (prev) => ({ ...prev, userID: updatedProfileData.val }),
      email: (prev) => ({ ...prev, email: updatedProfileData.val }),
      mobile_number: (prev) => ({
        ...prev,
        customer: prev.customer
          ? { ...prev.customer, mobile_number: updatedProfileData.val }
          : prev.customer,
      }),
      interest: (prev) => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, interest: updatedProfileData.val } : prev.customer,
      }),
      about: (prev) => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, about: updatedProfileData.val } : prev.customer,
      }),
      city_village: (prev) => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, city_village: updatedProfileData.val } : prev.customer,
      }),
      country: (prev) => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, country: updatedProfileData.val } : prev.customer,
      }),
      state: (prev) => ({
        ...prev,
        customer: prev.customer ? { ...prev.customer, state: updatedProfileData.val } : prev.customer,
      }),
    };
    
		
		if (updateFields[updatedProfileData.name]) {
      setUserProfileData((prev) => updateFields[updatedProfileData.name](prev));
    } 
		
  }, [userProfileData, setUserProfileData]);






//websocket event  listener
	const UserProfileUpdate_webSocketChannel = `update-user-profile`; 
	const UserProfileUpdate_connectWebSocket = () => {
			window.Echo.channel(UserProfileUpdate_webSocketChannel)
					.listen('ProfileUpdateEvent', async (e) => {
							// e.message   
							 
							handleUserProfileUpdate(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 
		UserProfileUpdate_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(UserProfileUpdate_webSocketChannel);
		};
	}, [  ]); // Call the effect only once on component mount
  
		
	 
};

export default useUserProfileUpdateWebsocket;
