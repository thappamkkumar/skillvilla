import { memo, useEffect, useState } from 'react';
import { useParams  } from 'react-router-dom';
import { useSelector } from 'react-redux'; 
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import ProfileHeader from '../../../Components/Admin/User/UserProfile/ProfileHeader';
import UserCompany from '../../../Components/Admin/User/UserProfile/UserCompany';

import ProfileActionButton from '../../../Components/Customer/Profile/ProfileActionButton';
import UserFeeds from '../../../Components/Customer/Profile/UserFeeds';

import ProfileDetail from '../../../Components/Customer/Profile/ProfileDetail';
import ProfileAbout from '../../../Components/Customer/Profile/ProfileAbout';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection'; 

import useUserProfileUpdateWebsocket from '../../../Websockets/Profile/useUserProfileUpdateWebsocket'; 
import useUserProfileFollowersCountUpdateWebsocket from '../../../Websockets/Profile/useUserProfileFollowersCountUpdateWebsocket'; 
import useUserProfileFollowingsCountUpdateWebsocket from '../../../Websockets/Profile/useUserProfileFollowingsCountUpdateWebsocket'; 


const UserProfilePage = () => { 
  const { userId, ID } = useParams(); // get id from URL parameter
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
  const authToken = useSelector((state) => state.auth.token); // get token from store
  const [userProfileData, setUserProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userFound, setUserFound] = useState(true);
   
	//call for add websoket event listener for profile updation
	useUserProfileUpdateWebsocket(	logedUserData, userProfileData, setUserProfileData ); 
	 //call for add websoket event listener for profile followers count updation
	useUserProfileFollowersCountUpdateWebsocket(	logedUserData, userProfileData, setUserProfileData ); 
	 //call for add websoket event listener for profile following count updation
	useUserProfileFollowingsCountUpdateWebsocket(	logedUserData, userProfileData, setUserProfileData ); 
	 
	
	 
 
	 
  useEffect(() => {
    const source = axios.CancelToken.source(); // Create a cancel token source

    const apiCall = async () => {
      try 
			{
				if(authToken == null){return;};
        setLoading(true);
				 
        // Call the function to fetch data from the server
        const data = await serverConnection('/admin/get-user-profile', { userId: ID }, authToken);
        
        //  console.log(data);
				if(data.status == true)
				{
					setUserProfileData(data.userData);
					setUserFound(true);
				}
				else
				{
					setUserFound(false);
				}
				
				 
      } catch (error) {
        if (axios.isCancel(error)) {
          console.log('Request canceled', error.message);
        } else {
          console.error(error);
        }
				setUserFound(false);
			}
			finally{
				setLoading(false);
			}
         
        
    };
    
    apiCall();
    
    return () => {
      // Cancel the request when the component unmounts
      source.cancel('Request canceled due to component unmount');
    };
  }, [userId, authToken]);
  
	
	
	
	
	if (loading) {
    return (
      <div className="py-4 px-2 main_container w-100 h-100 text-center">
        <Spinner animation="border" size="md" />
      </div>
    );
  }
  
	if (!loading && !userFound) {
    return (
       <div className="px-2 px-sm-3 px-md-4 px-lg-5 py-2">
        <p className="no_posts_message">User profile data not found.</p>
      </div>
    );
  }
 if (!userProfileData) {
    return ;
  } 



  const {id, name, userID, isFollowing, followers_count, following_count,  customer, chat_id } = userProfileData;
  const userProfileImage = !customer?null:customer.image;
  const about = !customer?null:customer.about;
  const company = userProfileData.company;

  const profileData = {
		id: id,
    userName: name,
    userId: userID, 
		isFollowing: isFollowing,
    totalFollowers: followers_count.toLocaleString(),
    totalFollowing: following_count.toLocaleString(),
    userProfileImage: userProfileImage,
		chatId: chat_id
  };


	
	
	

  return (
    <> 
			<PageSeo 
				title={userProfileData?.name ? `${userProfileData.name} | Admin | SkillVilla` : 'User Profile | Admin | SkillVilla'}
				description={userProfileData?.name ? `Admin view of ${userProfileData.name}'s profile on SkillVilla.` : 'View and manage user profiles from the admin panel.'}
				keywords={userProfileData?.name ? `admin user profile, ${userProfileData.name}, SkillVilla admin` : 'admin user profile, SkillVilla, manage user'}
			/>

			<Row className="w-100 m-auto p-0 pt-3 pt-md-5 pb-5 main_container">
				<Col xs={12} sm={12} md={10} lg={10} xl={8}
				className="px-2 px-md-4 px-lg-5 mx-auto  ">
					
					{/*it render profile image, user name and usr id and also followers and followings*/	}
				  <ProfileHeader profileData={profileData} setUserProfileData={setUserProfileData} />
					
					
					 
					
					{/*it render about the company of user and navigate to company profie*/}
					{
						company && 
						<> 
							<hr className="m-0 mt-3 mb-3" />  
							<UserCompany  company={company} />
							<hr className="m-0 mb-3 mt-3" />
						</>
					}
					 
				</Col>
				<Col xs={12} sm={12} className="px-0    mx-auto  " >
					 
					<ProfileDetail userProfileData={userProfileData}  />
					<ProfileAbout about={about} />
				</Col>
			</Row>
			
    </>
  );
};

export default memo(UserProfilePage);
