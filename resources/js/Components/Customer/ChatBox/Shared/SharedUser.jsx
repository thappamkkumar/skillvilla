import {  memo, useCallback }  from 'react';    
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';  
import Image from 'react-bootstrap/Image'; 
import { BsLink45Deg } from "react-icons/bs";
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
import handleImageError from '../../../../CustomHook/handleImageError';

const SharedUser = ({user}) => {
	
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
		const userID = user.userID;
		const ID = user.id;
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
			
	}, [logedUserData, user]);
	
	
	
  return (
	
		<div className=" mb-2">
		<div  
			className=" w-100  h-auto btn btn-light text-start   d-flex     align-items-center"		
			style={{
				maxWidth:'300px', 
				cursor:'pointer'
			}}
			onClick={handleNavigateToUserProfile}
		>
      <div className="  p-0 border-0 "  > 
						
				<Image src={user?.customer?.image || '/images/login_icon.png'} 
				className="profile_img"
				onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
				alt={`profile image of ${user.userID}`}/> 
				
			</div>
			<div className="ps-2 overflow-hidden">
				<strong className="d-block fw-semibold text-truncate">{user.userID}</strong>
				<small className="d-block  text-truncate">{user.name}</small>
			</div>
			
		</div>
		<small className="text-secondary fw-bold"> <BsLink45Deg /> User Profile</small>
		
	</div>
  );
};

export default memo(SharedUser);
