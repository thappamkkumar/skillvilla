import {useCallback, memo }  from 'react';  
import { useSelector } from 'react-redux';  
import { useNavigate } from 'react-router-dom';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';  

import User from '../../../Components/Customer/UserCard/User'
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const ExploreUserPage = () => {
  const userList = useSelector((state) => state.userList);  // Selecting post list from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	//handle navigation to user profile
	const navigateToUserProfile = useCallback((ID, userID)=>{
		if(logedUserData.id == ID )
		{
			//call function to add current url into array of visited url
		//	manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${userID}/${ID}/profile`, 'append');
			navigate(`/user/${userID}/${ID}/profile`);
		}
	},[logedUserData]);
	
  return (
		<>
			<PageSeo 
				title="Explore Professionals | SkillVilla"
				description="Browse skilled professionals and creators. Connect with talent, view portfolios, and grow your network."
				keywords="explore users, professionals, creators, networking, portfolios, talent"
			/>


     <Row className="w-100 mx-auto  px-0 py-0 px-sm-3 px-md-4 px-lg-5">
        {userList.userList.map((user) => (
          <Col xs={6} sm={6} md={4} lg={3} key={user.id} className="  m-0 p-2">
            {/* Display each post inside a column */}
            <div className="  rounded-2    post user_card p-2 " onClick={()=>{navigateToUserProfile(user.id, user.userID)}}>
              <User user={user} /> 
            </div>
          </Col>
        ))}
      </Row>
			 
		</>
  );
};

export default memo(ExploreUserPage);
