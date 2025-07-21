 import serverConnection from '../../../../../CustomHook/serverConnection'; 
 
 
const useRemoveInterest = async( index, setUserProfileData, setsubmitionMSG, setShowModel,   authToken )=>
	{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{
			  if (index === undefined || index < 0) {
					
					return;
				}
				var formData = {index:index}; 
				let url='/remove-interest'; 
				const responseData = await serverConnection(url, formData, authToken ); 
				
				if(responseData.status == true)
				{
					setUserProfileData((preUserData)=>({...preUserData, interest: responseData.interest}));
					
				}
				else
				{
					setsubmitionMSG(responseData.message || "Failed to remove interest.Try again.");
					setShowModel(true);
				}
				
				 
		} 
		catch (error)
		{
			if (axios.isCancel(error)) {
          //console.log('Request canceled', error.message);
        } else {
          //console.error(error);
        }
    setsubmitionMSG("An error occurred while removing interest.");
    setShowModel(true); 
    }
	};
	
export default useRemoveInterest;