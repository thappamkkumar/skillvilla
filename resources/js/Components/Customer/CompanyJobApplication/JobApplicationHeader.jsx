import   { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';  
import Image from 'react-bootstrap/Image';

import handleImageError from '../../../CustomHook/handleImageError';  
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const JobApplicationHeader = ({ user }) => {
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	
	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
		if(logedUserData.id == user.id )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${user.userID}/${user.id}/profile`, 'append');
			navigate(`/user/${user.userID}/${user.id}/profile`);
		}
			
	}, [user, logedUserData]);
	
	
  return (
    <div className="d-flex align-items-center px-2">
      <div className="btn p-0 border-0" onClick={handleNavigateToUserProfile}>
        <Image
          src={ user.customer.image ||  '/images/login_icon.png'}
          className="profile_img"
          onError={(event) => handleImageError(event, '/images/login_icon.png')}
          alt={`profile image of ${user.userId}`}
        />
      </div>
      <div
        className="p-0 ps-3 btn text-start w-auto border-0"
        onClick={handleNavigateToUserProfile}
      >
        <p className="p-0 m-0 fs-6 fw-semibold postTruncate">{user.name}</p>
        <p className="p-0 m-0 text-muted postTruncate">
          <small>{user.userID}</small>
        </p>
      </div>
    </div>
  );
};

export default memo(JobApplicationHeader);
