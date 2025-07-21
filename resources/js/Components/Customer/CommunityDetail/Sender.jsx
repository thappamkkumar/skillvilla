import { memo, useCallback}  from 'react';
import { useSelector } from 'react-redux';  
import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image';   

import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import handleImageError from '../../../CustomHook/handleImageError';

const Sender = ({user, style}) => {
  
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const navigate = useNavigate();
	
  //function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
		if(logedUserData.id == user.id )
		{
			//call function to add current url into array of visited url
			manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			manageVisitedUrl(`/user/${user.userID}/${user.id}/profile`, 'append');
			navigate(`/user/${user.userID}/${user.id}/profile`);
		}
			
	}, []);
	
  return (
	 	 
			<div className={`${style} gap-4 justify-content-between align-items-center     overflow-hidden py-2 px-2  sub_main_container  rounded`}
			onClick={handleNavigateToUserProfile}
			style={{cursor:'pointer'}}		
			>
				<div className="pe-3    "> 
					<strong className="  ">Shared by</strong> 
				</div>
				<Image 
						src={ user?.customer?.image || '/images/login_icon.png' }
						className="comment_profile_image" 
						onError={(e) => handleImageError(e, '/images/login_icon.png')}
						alt={`Profile image of ${user.userID}`}  
				/> 
					
			</div>
		 
  );
};

export default memo(Sender);
