 import serverConnection from '../../../../../CustomHook/serverConnection'; 
 
 
const useUpdatePassword = async( newPassword, confirmedNewPassword, setsubmitionMSG, setShowModel,   authToken, setPasswordChanged )=>
	{
		try
		{
		
			if (  authToken == null) { 
				return false;
			}
			if (!newPassword || newPassword.length === 0  ) { 
				setsubmitionMSG('The new password is empty.');
				setShowModel(true);
				return false;
			}
			 if (!confirmedNewPassword || confirmedNewPassword.length === 0  ) { 
				setsubmitionMSG('The confirm password is empty.');
				setShowModel(true);
				return false;
			}
			 
			
			if(newPassword != confirmedNewPassword)
			{
				setsubmitionMSG('New password and confirm password do not match. Please try again.');
				setShowModel(true);
				return false;
			}
			
			const formData = {password:newPassword}; 
			const url='/update-password'
			const responseData = await serverConnection(url, formData, authToken );    //console.log(responseData)
			if(responseData.status == true)
			{
				setPasswordChanged(true);
				setsubmitionMSG('Password is updated successfully.');
				setShowModel(true);
			}
			else
			{
				setPasswordChanged(false)
				setsubmitionMSG('The current password you entered is incorrect. Please try again.');
				setShowModel(true);
			}
		 
			 		
		} 
		catch (error)
		{
			 
       // console.error(error);
 
    setsubmitionMSG("An error occurred while add new interest.");
    setShowModel(true); 
    }
	};
	
export default useUpdatePassword;