 import serverConnection from '../../../../CustomHook/serverConnection'; 
 
 
const useVerifyCurrentPassword = async( val, setsubmitionMSG, setShowModel,   authToken )=>
	{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{
			  if (!val || val.trim().length === 0 || authToken == null) { 
					return false;
				}
				 
				const formData = {password:val}; 
				const url='/verify-current-password';
				const responseData = await serverConnection(url, formData, authToken ); 
				  // console.log(responseData)
				if(responseData.status == true)
				{
					return true;
					
				}
				else
				{
					setsubmitionMSG('The current password you entered is incorrect. Please try again.');
					setShowModel(true);
				} 
				return false;
		} 
		catch (error)
		{
			if (axios.isCancel(error)) {
          // console.log('Request canceled', error.message);
        } else {
         // console.error(error);
        }
			setsubmitionMSG("An error occurred while add new interest.");
			setShowModel(true);
			return false;		
    }
	};
	
export default useVerifyCurrentPassword;