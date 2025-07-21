 
import {memo, useState, useEffect, useCallback } from 'react'; 
import {useSelector, useDispatch} from 'react-redux';  
import { useNavigate } from 'react-router-dom';  
import { Navbar, Nav } from 'react-bootstrap';
import { HashLink } from "react-router-hash-link";
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import MessageAlert from '../../../../Components/MessageAlert';
 
import UpdateAbout from '../../../../Components/Customer/ProfileUpdate/UpdateAbout'; 
import UpdateBasicDetail from '../../../../Components/Customer/ProfileUpdate/UpdateBasicDetail';  
import UpdateInterest from '../../../../Components/Customer/ProfileUpdate/UpdateInterest';  
import UpdateEmail from '../../../../Components/Customer/ProfileUpdate/UpdateEmail';  
import UpdatePassword from '../../../../Components/Customer/ProfileUpdate/UpdatePassword';  
 import PageSeo from '../../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 import {  logout } from '../../../../StoreWrapper/Slice/AuthSlice';
 import authUpdate from '../../../../StoreWrapper/UpdateStore/authUpdate';
 
 
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../../CustomHook/serverConnection';

import useUpdateUserDetail from './UpdateProfileFunctions/useUpdateUserDetail';
import useRemoveInterest from './UpdateProfileFunctions/useRemoveInterest';
import useAddNewInterest from './UpdateProfileFunctions/useAddNewInterest';
import useVerifyCurrentPassword from './UpdateProfileFunctions/useVerifyCurrentPassword';
import useUpdatePassword from './UpdateProfileFunctions/useUpdatePassword';




const UpdateProfilePage = () => { 
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [userProfileData, setUserProfileData] = useState(null);
	const [loading, setLoading] = useState(false);
  const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message   
	const [passwordChanged, setPasswordChanged] = useState(false); //state for alert message   
	const dispatch = useDispatch();		
	const navigate = useNavigate();		
		
	useEffect(() => {
			if(authToken == null)return;
		
		const source = axios.CancelToken.source(); // Create a cancel token source
  	
    const apiCall = async () => {
      try {
        setLoading(true);
				let userInfo = null;
				if(logedUserData != null)
				{
					  userInfo = logedUserData.id;
				}
				
				
        // Call the function to fetch data from the server
        const data = await serverConnection('/user-profile', { userId: userInfo }, authToken);
				 //console.log(data.userData);
				
				let userData = null; 
				 
				userData = {
						name: data.userData.name,
						userID: data.userData.userID,
						email: data.userData.email,
						mobileNumber: data.userData.customer.mobile_number,
						cityVillage: data.userData.customer.city_village,
						state: data.userData.customer.state,
						country: data.userData.customer.country,
						interest: data.userData.customer.interest,
						about: data.userData.customer.about,
						image: data.userData.customer.image,
				};
				 

         setUserProfileData(userData);
        setLoading(false);
      } catch (error) {
        if (axios.isCancel(error)) {
         // console.log('Request canceled', error.message);
        } else {
          //console.error(error);
        }
        setLoading(false);
      }
    };
    
    apiCall();
    
    return () => {
      // Cancel the request when the component unmounts
      source.cancel('Request canceled due to component unmount');
    };
  }, [ authToken]);
  
	
	
	//function for handlle  form submition
	const handleSubmit = useCallback((event)=>{
		 event.preventDefault();
	 }, []);
	 
	
	//function for handlle remove of user interest  
	const removeInterest =  useCallback((index)=>
	{
		useRemoveInterest(index, setUserProfileData, setsubmitionMSG, setShowModel,   authToken );
	},[userProfileData, authToken]);
	
	//function for handlle add new of user interest  
	const addNewInterest =  useCallback((val)=>
	{
		useAddNewInterest(val, setUserProfileData, setsubmitionMSG, setShowModel,   authToken );
	},[userProfileData, authToken]);
	
	
	
	
	//function for handlle user detail update  
	const handleUserDetailUpdate =  useCallback((event)=>
	{
		let val = event.target.value.trim().replace(/<[^>]*>?/gm, '');
		event.target.value = val;
		let fname = event.target.name;
		useUpdateUserDetail(fname, val, userProfileData , setsubmitionMSG, setShowModel, dispatch, authToken );
	},[userProfileData, authToken]);
	
	//function for handlle user about update  
	const handleUserAboutUpdate =  useCallback((val)=>
	{   
		useUpdateUserDetail('about', val, userProfileData , setsubmitionMSG, setShowModel, dispatch, authToken );
	},[userProfileData, authToken]);
	
	 
	//function for Verifying currrent Password
	const verifyCurrentPassword = useCallback(async(val)=>{
		return await useVerifyCurrentPassword(val, setsubmitionMSG, setShowModel,   authToken  );
	},[authToken]);
	
	//function for update function Password
	const updatePassword = useCallback((newPassword, confirmedNewPassword)=>{
		useUpdatePassword(newPassword, confirmedNewPassword, setsubmitionMSG, setShowModel,   authToken, setPasswordChanged  );
	},[authToken]);
	
	
	
	
	//function that handle key press and check the key is enter key if true then submit the detail value
	const handleKeyPress =  useCallback((event) => {
		 
        if (event.key == 'Enter') 
				{ 
					event.preventDefault();
					event.target.blur();
					return;
        }
  },[]);
	
	
	//function for closing message box and if password changed then logout
	const handleCloseMessageBox =  useCallback((event) => {
		setShowModel(false);
		if(passwordChanged)
		{
			dispatch(logout());
			authUpdate(false, '', []); 
		//	manageVisitedUrl('/', 'addNew');
			setPasswordChanged(false);
			navigate('/');
			
		}
        
  },[passwordChanged]);
	
	
	
	
	
	
	// Navigation items for sections
  const navItems = [
    { type: "detail", label: "Detail", path: "#detail" },
    { type: "interest", label: "Interest", path: "#interest" },
    { type: "password", label: "Password", path: "#password" },
    { type: "about", label: "About", path: "#about" },
  ];
	
	 

	return (
		<>
			<PageSeo 
				title={userProfileData?.name ? `Edit ${userProfileData.name}'s Profile | SkillVilla` : 'Edit Profile | SkillVilla'}
				description={userProfileData?.name ? `Update ${userProfileData.name}'s personal and professional details on SkillVilla.` : 'Edit your SkillVilla profile to reflect your professional identity.'}
				keywords={userProfileData?.name ? `edit profile, ${userProfileData.name}, SkillVilla, update profile` : 'edit profile, SkillVilla, update user details'}
			/>

			<div className="pb-5 pt-3 main_container">
				{loading ? (
					<div className="py-4 px-2 text-center ">
						<Spinner animation="border" size="md" />
					</div>
				) : (
					userProfileData !== null ? (
						<Row className="w-100 m-auto p-0 px-2 px-md-4 px-lg-5    " >
							<Col xs={12} sm={12} md={10} lg={10} xl={8}
								className=" p-0 mx-auto   ">
							
								 {/* Navigation Box */}
								 <div className="w-100 sub_main_container rounded-1   shadow"   >
										<Navbar className="p-0 w-100 nav_bar">
											<Nav className="w-100 gap-1 px-2 py-2 overflow-auto justify-content-around">
												{navItems.map(({ type, label, path }) => (
													<Nav.Item key={type} className="flex-grow-1">
														<Nav.Link
															as={HashLink}
															smooth to={path} 
															className="rounded-1 px-2 py-1 navigation_link explore_navigation_link text-center  "
															title={`Go to ${label.toLowerCase()} page`}
														>
															{label}
														</Nav.Link>
													</Nav.Item>
												))}
											</Nav>
										</Navbar>
									</div>
							
							</Col>
							<Col xs={12} sm={12} className="px-0  py-5 mx-auto   " >
								<Form onSubmit={handleSubmit}>
									{/* Sections */}
								
									<section  id="detail" className="mb-4"   >
										
										<div className="sub_main_container rounded  px-3 px-lg-5 py-3 py-lg-5">
											<h3>Basic Detail</h3>
											
											<UpdateEmail 
											setsubmitionMSG = {setsubmitionMSG}
											setShowModel = {setShowModel}
											email={userProfileData.email} />
											
										 <UpdateBasicDetail 
												userData=
												{{
													userID:userProfileData.userID,
													name:userProfileData.name,
													mobileNumber:userProfileData.mobileNumber,
													cityVillage:userProfileData.cityVillage,
													state:userProfileData.state,
													country:userProfileData.country
												}} 
												
												handleUserDetailUpdate={handleUserDetailUpdate}
												handleKeyPress={handleKeyPress}
										 />
										</div>
									</section>

									<section id="interest" className="mb-4">
										<div className="sub_main_container rounded  px-3 px-lg-5 py-3 py-lg-5">
											<h3>Interest</h3>  
											<UpdateInterest interest={userProfileData.interest} removeInterest={removeInterest} addNewInterest={addNewInterest}    />
										</div>
									</section>

									<section id="password" className="sub_main_container rounded  px-3 px-lg-5   py-3 py-lg-5 mb-4">
										<h3>Password </h3>
										<UpdatePassword 
											verifyCurrentPassword={verifyCurrentPassword} 
											updatePassword={updatePassword} 
											handleKeyPress={handleKeyPress}
										/>
									</section>

									<section id="about"  className="sub_main_container rounded  px-3 px-lg-5   py-3 py-lg-5"  >
										<h3>About</h3>
										
										<UpdateAbout 
											userProfileData={userProfileData} 
											handleUserAboutUpdate={handleUserAboutUpdate} 
										/>
									</section>
									
									
									<section className="pt-5">
										<p><small><strong>Note :- </strong> Click on Enter key or outside the selected field to updated the selected field.</small></p>
											
									</section>
								</Form> 
							</Col>
						</Row>
					):(
						<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
								<p className="no_posts_message  ">
								 User profile data not found.
								</p>
							</div>
					)
				)}
				
				<MessageAlert setShowModel={handleCloseMessageBox} showModel={showModel} message={submitionMSG}/>
				
			</div>
		</>
  );
	
};

export default memo(UpdateProfilePage);
