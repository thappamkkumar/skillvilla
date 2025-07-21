 
import   {useEffect, useState, useCallback, memo }  from 'react';   
import {useSelector, useDispatch   } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';  
import  Spinner  from 'react-bootstrap/Spinner';  
import  Row  from 'react-bootstrap/Row';  
import  Col  from 'react-bootstrap/Col';  
import Form from 'react-bootstrap/Form';
  
import UpdateBasicDetail from '../../../Components/Admin/AdminProfileUpdate/UpdateBasicDetail';    
import UpdateEmail from '../../../Components/Admin/AdminProfileUpdate/UpdateEmail';  
import UpdatePassword from '../../../Components/Admin/AdminProfileUpdate/UpdatePassword';  
 
 import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import MessageAlert from '../../../Components/MessageAlert';
 
import {  logout } from '../../../StoreWrapper/Slice/AuthSlice';
import authUpdate from '../../../StoreWrapper/UpdateStore/authUpdate';
 
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';   
 
 
import useUpdateUserDetail from './UpdateProfileFunctions/useUpdateUserDetail';
import useVerifyCurrentPassword from './UpdateProfileFunctions/useVerifyCurrentPassword';
import useUpdatePassword from './UpdateProfileFunctions/useUpdatePassword';


const UpdateAdminProfilePage = () => {  
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [profileDetail, setProfileDetail] = useState(null);
	const [loading, setLoading] = useState(false);
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message   
	const [passwordChanged, setPasswordChanged] = useState(false); //state for alert message   
	const dispatch = useDispatch();		
	const navigate = useNavigate();		
   
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
			if(authToken == null)
			{
				return;
			}
			setLoading(true);
			 
			let requestData = {} ;
			let url = `/admin/get-admin-profile`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			//console.log(data);
			 
			if(data != null && data.user != null )
			{     
					setProfileDetail(data.user)
					 
			} 
			setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[ authToken]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
		apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken]);
	
	
	
	
	//function for handlle  form submition
	const handleSubmit = useCallback((event)=>{
		 event.preventDefault();
	 }, []);
	 
	
	
	//function for handlle user detail update  
	const handleUserDetailUpdate =  useCallback((event)=>
	{
		useUpdateUserDetail(event, profileDetail , setsubmitionMSG, setShowModel, dispatch, authToken );
	},[profileDetail, authToken]);
	
	 
	//function for Verifying currrent Password
	const verifyCurrentPassword = useCallback(async(val)=>{
		return await useVerifyCurrentPassword(val, setsubmitionMSG, setShowModel,   authToken  );
	},[authToken]);
	
	//function for update function Password
	const updatePassword = useCallback((newPassword, confirmedNewPassword)=>{
		useUpdatePassword(newPassword, confirmedNewPassword, setsubmitionMSG, setShowModel,   authToken, setPasswordChanged  );
	},[authToken]);
	
	
	//function for closing message box and if password changed then logout
	const handleCloseMessageBox =  useCallback((event) => {
		setShowModel(false);
		if(passwordChanged)
		{
			dispatch(logout());
			authUpdate(false, '', []); 
			//manageVisitedUrl('/', 'addNew');
			setPasswordChanged(false);
			navigate('/');
			
		}
        
  },[passwordChanged]);
	


	//function that handle key press and check the key is enter key if true then submit the detail value
	const handleKeyPress =  useCallback((event) => {
		 
        if (event.key == 'Enter') 
				{ 
					event.preventDefault();
					event.target.blur();
					return;
        }
  },[]);
	
	
	
	return ( 
		<>	
			<PageSeo 
				title="Edit Admin Profile | SkillVilla"
				description="Update your admin profile information and preferences on SkillVilla."
				keywords="edit admin profile, SkillVilla admin, profile update"
			/>

			<div   className="pt-2  pb-5 px-0 px-md-4 px-lg-5 main_container  " id="mainScrollableDiv"> 
				
				{
					loading ? (
						<div className="py-4 px-2   w-100 h-100 text-center">
							<Spinner animation="border" size="md" />
						</div>
						
					):(
					
						<>
							{
								profileDetail != null 
								?
								(
									<Row className="w-100 m-auto p-0   ">
										 
										
										<Col xs={12} sm={12} className="px-0  py-3 mx-auto  " >
											<Form onSubmit={handleSubmit}>
									
												<section  id="detail" className="mb-4"   > 
													<div className="sub_main_container rounded  px-3 px-lg-5 py-3 py-lg-5">
														<h3>Basic Detail</h3>
														
															<UpdateEmail 
															setsubmitionMSG = {setsubmitionMSG}
															setShowModel = {setShowModel}
															email={profileDetail.email} />
															
														 <UpdateBasicDetail 
																userData=
																{{
																	userID:profileDetail.userID,
																	name:profileDetail.name,
																	mobileNumber:profileDetail.admin.mobile_number,
																	cityVillage:profileDetail.admin.city_village,
																	state:profileDetail.admin.state,
																	country:profileDetail.admin.country
																}} 
																
																handleUserDetailUpdate={handleUserDetailUpdate}
																handleKeyPress={handleKeyPress}
														 />
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
												
											</Form>
										</Col>
									</Row>
					
								):(
								
									<div className="px-2 px-sm-3 px-md-4 px-lg-5 py-2">
										<p className="no_posts_message">User profile data not found.</p>
									</div>
								)
							}
						</>
					)
					
				}
				 
					<MessageAlert setShowModel={handleCloseMessageBox} showModel={showModel} message={submitionMSG}/>
					
			</div>
		</>
	);
};

export default memo(UpdateAdminProfilePage);
