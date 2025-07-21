import { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button';


import RatingStars from '../../Common/RatingStars'; 
import handleImageError from '../../../CustomHook/handleImageError';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const FreelanceHirerAndRating = ({ freelance_id,  user }) => {
 

 const navigate = useNavigate();
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	 
  // Function to navigate to the user profile
  const navigateUserProfile = useCallback(() => {
		if (!user) return;
		const userID = user.userID;
		const ID = user.id;
		if(logedUserData.id == ID )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${userID}/${ID}/profile`, 'append');
			navigate(`/user/${userID}/${ID}/profile`);
		}
  }, [user]);

  
  // User/Hirer Information 
  const userContent =   (
    <div className="d-flex align-items-center"> 
		
			<Image
        src={user.customer.image || '/images/login_icon.png'}
        className="comment_profile_image"
        onError={(event) => handleImageError(event, '/images/login_icon.png')}
        alt={`profile image of ${user.name}`}
        roundedCircle
      />
      <Button
        variant="link"
        id={`userProfileButton${user.id}${freelance_id}`}
        title={`View profile of ${user.name}`}
        className="p-0 px-2 post_tags"
        onClick={navigateUserProfile}
      >
        {user.userID}
      </Button>
			 
    </div>
  ); 
	
	//user/Hirer review and rating
  const hirerRatingReview = user?.hirer_review_stats ? (
	<>
		<span className="text-secondary ps-2 fs-5">|</span>
    <div className="d-flex align-items-center">
      <RatingStars rating={user.hirer_review_stats.avg_rating || 0} small={true} />
      <small className="px-2 py-1 ms-2 rounded-1 tech_skill">{user.hirer_review_stats.review_count || 0} reviews</small>
    </div>
	</>
  ) : null;

  return (
    <div className="d-flex flex-wrap align-items-center gap-2 pb-2 pt-1">
     
      {userContent}
      {  hirerRatingReview}
				 
    </div>
  );
};

export default memo(FreelanceHirerAndRating);
