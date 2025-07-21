 

import   {memo, useCallback } from 'react';   

import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux'; 
import Image from 'react-bootstrap/Image'; 

 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

const WorkfolioUploadBy = ({user }) => {
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	 

	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	
	//handle navigate to user profile
	const handlenavigateToProfile = useCallback(()=>
	{
		 
		if(logedUserData.id == user.id )
		{
			//call function to add current url into array of visited url
		//	manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${user.userID}/${user.id}/profile`, 'append');
			navigate(`/user/${user.userID}/${user.id}/profile`);
		}
	},[user.userID,user.id ]);
	 
	 
	
	return ( 
	
		<div 
			className="d-flex align-items-center  "
			onClick={handlenavigateToProfile}
			style={{cursor:'pointer'}}
		> 
		
			<Image
        src={user?.customer?.image || '/images/login_icon.png'}
        className="comment_profile_image"
        onError={(event) => handleImageError(event, '/images/login_icon.png')}
        alt={`profile image of ${user.name}`}
         
      />
      <span
         
        title={`View profile of ${user.userID}`}
        className="p-0 px-2 text-decoration-underline post_tags" 
      >
        {user.userID}
      </span>
			
    </div>
	
		 
	);
	
};

export default memo(WorkfolioUploadBy);
