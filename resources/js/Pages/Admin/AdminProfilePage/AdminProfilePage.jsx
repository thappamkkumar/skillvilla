 
import   {useEffect, useState, useCallback, memo }  from 'react';   
import {useSelector   } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner';  
import  Row  from 'react-bootstrap/Row';  
import  Col  from 'react-bootstrap/Col';  
 
import ProfileHeader from '../../../Components/Admin/AdminProfile/ProfileHeader';   
import ProfileDetail from '../../../Components/Admin/AdminProfile/ProfileDetail';   
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection';   
 
 
 

const AdminProfilePage = () => {  
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [profileDetail, setProfileDetail] = useState(null);
	const [loading, setLoading] = useState(false);
	   
	
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
	
	 
	  
	return ( 
		<>
			<PageSeo 
				title="Admin Profile | SkillVilla"
				description="View your admin profile and account details on SkillVilla."
				keywords="admin profile, SkillVilla admin, account settings"
			/>

			<div   className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container  " id="mainScrollableDiv"> 
				
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
									<Row className="w-100 m-auto p-0 pt-3 pt-md-5 pb-5  ">
										<Col xs={12} sm={12} md={10} lg={10} xl={8}
										className="px-2 px-md-4 px-lg-5 mx-auto  ">
											<ProfileHeader  profileData = {profileDetail} setProfileData = {setProfileDetail} />
										</Col>
										
										<Col xs={12} sm={12} className="px-0  py-3 mx-auto  " >
											<ProfileDetail  profileData = {profileDetail} />
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
				 
				 
			</div>
		</>
	);
};

export default memo(AdminProfilePage);
