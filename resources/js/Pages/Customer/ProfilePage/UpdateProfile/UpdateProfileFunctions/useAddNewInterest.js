 import serverConnection from '../../../../../CustomHook/serverConnection'; 
 
 
const useAddNewInterest = async( val, setUserProfileData, setsubmitionMSG, setShowModel,   authToken )=>
	{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{
			  if (!val || val.trim().length === 0) { 
					return;
				}
				var formData = {newInterest:val}; 
				let url='/add-interest'; 
				const responseData = await serverConnection(url, formData, authToken ); 
				   
				if(responseData.status == true)
				{
					setUserProfileData((preUserData)=>({...preUserData, interest: responseData.interest}));
					
				}
				else
				{
					setsubmitionMSG(responseData.message || "Failed to add new interest.");
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
    setsubmitionMSG("An error occurred while add new interest.");
    setShowModel(true); 
    }
	};
	
export default useAddNewInterest;