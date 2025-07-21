
import {memo, useState, useEffect, useCallback } from 'react'; 
import {useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';  
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';
import { updateProfileImage, updateUserID, updateEmail, updateName, logout } from '../../../StoreWrapper/Slice/AuthSlice';
import authUpdate from '../../../StoreWrapper/UpdateStore/authUpdate';
 
import UpdateEmail from './Update/UpdateEmail';
import UpdateUserIDName from './Update/UpdateUserIDName';
import UpdateCandidateBasicDetail from './Update/UpdateCandidateBasicDetail';
import UpdateAbout from './Update/UpdateAbout';
import UpdateInterest from './Update/UpdateInterest';
import UpdatePassword from './Update/UpdatePassword';

import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';
import handleImageError from '../../../CustomHook/handleImageError';
import generateOTP from '../../../CustomHook/generateOTP';
import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';


const UpdateCandidateProfile= ({userProfileData, setUserProfileData}) => { 
	
	 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	//const [userData, setUserData] = useState(null);
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [newEmail, setNewEmail] = useState('');
	const [otp, setOTP] = useState({status : false, OTP : ''});
	const [reSendOTP, setReSendOTP] = useState(false);
	const [enteredOTP, setEnteredOTP] = useState('');
	const dispatch = useDispatch();	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	


	useEffect(()=>{ 
		//setUserData(userProfileData);
		setNewEmail(userProfileData.email);	
	},[userProfileData]);
	
	const handleSubmit = useCallback((event)=>{
		 event.preventDefault();
	 }, []);
	 
 

	//function for handlle user detail update like name,mobile_number,city_village,state,country
	const handleUserDetailUpdate =  useCallback(async(event)=>
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
				const mobileRegex = /^[0-9]{10}$/;
				if(!mobileRegex.test(val))
				{
					setsubmitionMSG("Invalid mobile number. Please enter a 10-digit number.");
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
				url = '/update-user-detail';
			}
			const data = await serverConnection(url, formData, authToken ); 
			
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
			if(data.status == true)
			{
				setsubmitionMSG( msg + ' is updated successfully');
				setShowModel(true);
			}
			else
			{
				setsubmitionMSG(data.message);
				setShowModel(true);
			}
		} 
		catch (error)
		{
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
       
    }
	}, [userProfileData]);
	
	 
	//function that handle key press and check the key is enter key if true then submit the detail value
	const handleKeyPress =  useCallback((event) => {
		 
        if (event.key == 'Enter') 
				{ 
					event.preventDefault();
					event.target.blur();
					return;
        }
  },[]);

	
	//function that handle email validation
	const getEnteredEmail = useCallback((event)=>{
		setNewEmail(event.target.value);
		  
	}, []);
	
//function that handle email validation
	const sendOTP =  useCallback(async()=>{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{
			if(newEmail != userData.email)
			{
				let OTP = generateOTP();
				setsubmitionMSG('Verifying your email.');
				setShowModel(true);
				var formData = {email:newEmail, otp:OTP}; 
				let url='/send-OTP'; 
				const responseData = await serverConnection(url, formData, authToken ); 
				//console.log(responseData);
				 
				setsubmitionMSG('');
				setShowModel(false);
				setOTP({status : true, OTP : OTP}); 
				
				if(responseData.status == false)
				{
					setOTP({status : false, OTP : ''}); 
					setsubmitionMSG(responseData.message);
					setShowModel(true);
				}
				const timer = setTimeout(() => {
            setReSendOTP(true);
						setOTP({status : false, OTP : ''});
        }, 300000); // Show message for 3 seconds

        return () => clearTimeout(timer);
			}
		} 
		catch (error)
		{
			if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
       
    }
	}, [newEmail]);

	//function use to handle enterd opt
	const getEnteredOTP = useCallback((event)=>{
		setEnteredOTP(event.target.value.trim());
		 
	}, []);
	
	//function use to handle otp validation and verification
	const VerifyOTP = useCallback(async()=>{
	 
		if(enteredOTP === otp.OTP)
		{
			var formData = {email:newEmail }; 
			let url='/update-email'; 
			const responseData = await serverConnection(url, formData, authToken );  
			setOTP({status : false, OTP : ''}); 
			if(responseData.status == true)
			{
				dispatch(updateEmail({email: newEmail}));
				setsubmitionMSG(responseData.message);
				setShowModel(true);
			}
			else
			{
				setsubmitionMSG(responseData.message);
				setShowModel(true);
			}
			
		}
		else
		{
			setsubmitionMSG('Entered OTP is not valid.');
			setShowModel(true);
		}
	
	},[enteredOTP, otp]);

	
	//function use to handle remove Skill or Technology of user
	const removeInterest = useCallback(async(index)=>{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{
			  
				var formData = {index:index}; 
				let url='/remove-interest'; 
				const responseData = await serverConnection(url, formData, authToken ); 
				
				if(responseData.status == true)
				{
					setUserProfileData((preUserData)=>({...preUserData, interest: responseData.interest}));
					
				}
				
				 
		} 
		catch (error)
		{
			if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
       
    }
		 
	}, [userProfileData, setUserProfileData]);
	
	//function for add new Technology or skills*/
	const addInterest = useCallback(async(val)=>{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{ 
			
				var formData = {newInterest:val}; 
				let url='/add-interest'; 
				const responseData = await serverConnection(url, formData, authToken ); 
				 
				if(responseData.status == true)
				{
					setUserProfileData((preUserData)=>({...preUserData, interest: responseData.interest}));
				}
				 
		} 
		catch (error)
		{
			if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
       
    }
	
	}, [userProfileData, setUserProfileData]);
	
	//function for Verifying currrent Password
	const verifyCurrentPassword = useCallback(async(val)=>{
		const source = axios.CancelToken.source(); // Create a cancel token source
		try
		{
			  
				var formData = {password:val}; 
				let url='/verify-current-password'; 
				const responseData = await serverConnection(url, formData, authToken ); 
				 
				if(responseData.status == false)
				{
					setsubmitionMSG('The current password you entered is incorrect. Please try again.');
					setShowModel(true);
					return false;
				}
				else
				{
					return true;
				}
		} 
		catch (error)
		{
			if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
       
    }
	},[]);
	
	//function for update Password
	const updatePassword = useCallback(async(newPassword, confirmedNewPassword)=>{
		if(newPassword == confirmedNewPassword)
		{
			try
			{
					
					var formData = {password:newPassword}; 
					let url='/update-password'; 
					const responseData = await serverConnection(url, formData, authToken ); 
					 //console.log(responseData);
					if(responseData.status == false)
					{
						setsubmitionMSG(responseData.message);
						setShowModel(true);
						
					}
					else
					{
						setsubmitionMSG('Password is updated successfully.');
						setShowModel(true);
						setTimeout(() => {
							dispatch(logout());
							authUpdate(false, '', []); 
							manageVisitedUrl('/', 'addNew');
							navigate('/login');
						}, 2000);
					}
			} 
			catch (error)
			{
				if (axios.isCancel(error)) {
						console.log('Request canceled', error.message);
					} else {
						console.error(error);
					}
				 
			}
		}
		else
		{
			setsubmitionMSG('New password and confirm password do not match. Please try again.');
			setShowModel(true);
		}
	},[]);
	

	return ( 
		<div className="pb-5  w-100 h-100 overflow-auto  " >
		<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
		{ userProfileData != null &&
			 	 <Form onSubmit={handleSubmit}>
					
					 
					
					
					{/*section for update or add skills*/}
					<section className="p-3">
						<h4 className="pb-2">Interest </h4> 
						<UpdateInterest interest={userProfileData.interest} removeInterest={removeInterest} addInterest={addInterest}    />
					</section>
					
					
					
					<section className="p-3">
						<h4 className="pb-2">Details  </h4>  
						{/* Email*/}
						<UpdateEmail  otp={otp} email={userProfileData.email} getEnteredEmail={getEnteredEmail} sendOTP={sendOTP} reSendOTP={reSendOTP} getEnteredOTP={getEnteredOTP} VerifyOTP={VerifyOTP} />
						
						{/* User ID and Name*/}	
						<UpdateUserIDName  userData={{userID:userProfileData.userID, name:userProfileData.name}} handleUserDetailUpdate={handleUserDetailUpdate} handleKeyPress={handleKeyPress} />
						
						{/* Basic Detail*/}
						<UpdateCandidateBasicDetail  userData={{mobileNumber:userProfileData.mobileNumber, cityVillage:userProfileData.cityVillage, state:userProfileData.state, country:userProfileData.country}}   handleUserDetailUpdate={handleUserDetailUpdate} handleKeyPress={handleKeyPress} />
					</section>
					
					
					{/* Paswword*/}
					<section className="p-3">
						<h4 className="pb-2">Password </h4> 
						<UpdatePassword verifyCurrentPassword={verifyCurrentPassword} updatePassword={updatePassword} handleKeyPress={handleKeyPress}/>
					</section>
					
					{/* About*/}
					<UpdateAbout about={userProfileData.about} handleUserDetailUpdate={handleUserDetailUpdate} handleKeyPress={handleKeyPress}  />
					
				</Form>
				
		}
			<section className="p-3">
					<p><small><strong>Note :- </strong> Click on Enter key or outside the selected field to updated the selected field.</small></p>
						
				</section>
		</div>
	);
	
};

export default memo(UpdateCandidateProfile);
