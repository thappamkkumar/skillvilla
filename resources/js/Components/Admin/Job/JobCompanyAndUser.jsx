import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';

import handleImageError from '../../../CustomHook/handleImageError';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const JobCompanyAndUser = ({ job_id, company, user = null }) => {
  const navigate = useNavigate();
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	 
  // Function to navigate to the company profile
  const navigateCompanyProfile = useCallback(() => {
		//manageVisitedUrl(`/admin/company-detail/${company.id}`, 'append');
		navigate(`/admin/company-detail/${company.id}`);
  }, [company]);

  // Function to navigate to the user profile
  const navigateUserProfile = useCallback(() => {
		const userID = user.userID;
		const ID = user.id;
    
		//manageVisitedUrl(`/admin/user-profile/${userID}/${ID}`, 'append');
		navigate(`/admin/user-profile/${userID}/${ID}`);
		 
  }, [user]);

  // Company Logo and Name
  const companyContent = (
	<div className="d-flex align-items-center overflow-hidden p-1"> 
		
			<Image
        src={company.logo || '/images/login_icon.png'}
        className="comment_profile_image"
        onError={(event) => handleImageError(event, '/images/login_icon.png')}
        alt={`Logo of ${company.name}`}
        roundedCircle
      />
      <Button
				variant="link"
				id={`companyProfileButton${company.name}${company.id}${job_id}`}
				title={`View profile of ${company.name}`}
				onClick={navigateCompanyProfile}
				className="  p-0 px-2  border-0 text-start post_tags postTruncate"
			>
				 {company.name} 
			</Button>
			
    </div>
    
  );

  // User Information (Conditional)
  const userContent = user && (
    <div className="d-flex align-items-center overflow-hidden p-1 "> 
		
			<Image
        src={user.customer.image || '/images/login_icon.png' }
        className="comment_profile_image"
        onError={(event) => handleImageError(event, '/images/login_icon.png')}
        alt={`profile image of ${user.name}`}
         
      />
      <Button
        variant="link"
        id={`userProfileButton${user.id}${job_id}`}
        title={`View profile of ${user.name}`}
        className="p-0 px-2 post_tags  text-decoration-none text-start postTruncate"
        onClick={navigateUserProfile}
      >
        {user.userID}
      </Button>
			
    </div>
  );

  return (
    <div className="d-flex flex-wrap   align-items-center pb-2  ">
     
      {userContent}
				{user && ( <span className="text-secondary px-3   fs-5">|</span>)}
			 {companyContent}
    </div>
  );
};

export default memo(JobCompanyAndUser);
