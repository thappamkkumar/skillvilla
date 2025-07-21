 import serverConnection from '../../../../CustomHook/serverConnection'; 
 import {  updateUserID,  updateName } from '../../../../StoreWrapper/Slice/AuthSlice';
 
const useUpdateUserDetail = async(event, userProfileData , setsubmitionMSG, setShowModel, dispatch, authToken )=>
	{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{
			
			let msg = '';
			
			let val = event.target.value.trim().replace(/<[^>]*>?/gm, '');
			event.target.value = val;
			let fname = event.target.name;
			//check the enterd value is same as previous if yes then return back
			if((fname == 'name' && val == userProfileData.name) || (fname == 'mobile_number' && val == userProfileData.mobileNumber) || (fname == 'city_village' && val == userProfileData.cityVillage) || (fname == 'state' && val == userProfileData.state) || (fname == 'country' && val == userProfileData.country) || (fname == 'about' && val == userProfileData.about) || (fname == 'userID' && val == userProfileData.userID))
			{
				return;
			}
			
 
			
			//check the field is not empty
			if(val.length <= 0)
			{
				setsubmitionMSG(fname + " can't be empty.");
				setShowModel(true);
				return;
			}
			//check mobile number is valid or not
			if(fname == 'mobile_number')
			{
				const mobileRegex = /^[0-9]+$/;
				if(!mobileRegex.test(val))
				{
					setsubmitionMSG("Invalid input. Only digits are allowed in the mobile number.");
					setShowModel(true);
					return;
				}
				if (val.length !== 10) {
					setsubmitionMSG("Invalid length. Mobile number must be exactly 10 digits.");
					setShowModel(true);
					return;
				}
			}
			//in user id replace empty space with underscore
			if(fname == 'userID')
			{
				 val = val.replace(/ /g , '_');
				 event.target.value = val;
			}
			const formData = new FormData();
			formData.append('name', fname);
			formData.append('value', val); 
			
			 
			
			let url = '';
			if(fname == 'userID')
			{
				url = '/update-userID';
			}
			else
			{			
				url = '/admin/update-profile-detail';
			}
			const data = await serverConnection(url, formData, authToken ); 
			
			if(data == null || (data != null && data.status == false))
			{ 
				setsubmitionMSG(data.message);
				setShowModel(true);
				return;
			}
			
			if(fname == 'userID' && data.status == true)
			{
				dispatch(updateUserID({userID: val}));
			}
			if(fname == 'name' && data.status == true)
			{
				dispatch(updateName({name: val}));
			}
			
			switch(fname)
			{
				case 'name':
					msg = 'Name';
					break;
				case 'mobile_number':
					msg = 'Mobile number';
					break;
				case 'city_village':
					msg = 'City/Village';
					break;
				case 'state':
					msg = 'State';
					break;
				case 'country':
					msg = 'Country';
					break;
				case 'about':
					msg = 'About';
					break;
				case 'userID':
					msg = 'User Id';
					break;
				default:
					msg = 'Detail';
					break;
			}
			setsubmitionMSG( msg + ' is updated successfully');
			setShowModel(true);
			 
		} 
		catch (error)
		{
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
       
    }
	};
	
export default useUpdateUserDetail;