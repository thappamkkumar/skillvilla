 

import   {memo, useState, useCallback } from 'react';   

import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button'; 
  
 
import handleImageError from '../../../CustomHook/handleImageError';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 

const PostHeader = ({userProfile, userID, ID,   postID,userName,  }) => {
	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
		 
			//call function to add current url into array of visited url
		//	manageVisitedUrl(`/admin/user-profile/${userID}/${ID}`, 'append');
		navigate(`/admin/user-profile/${userID}/${ID}`);
		 
	}, []);
	  
	
	return ( 
		 	 	<div className="p-2 w-100  h-auto d-flex     align-items-center">
						<div className="btn p-0 border-0 " onClick={handleNavigateToUserProfile} > 
						
							<Image src={userProfile || '/images/login_icon.png'} 
							className="profile_img"
							onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
							alt={`profile image of ${userID}, associated with post "${postID}"`}/> 
							
						</div>
						<div className="btn p-0 border-0 ps-3  " style={{overflow:'hidden'}} >
							
							<Button variant="*" className="border-0   fw-bold text-start p-0 fs-5 postTruncate" id={`userProfileNavigationBtn${postID}${userID}${userName}`} title={`Go to user profile of ${userID}`} onClick={handleNavigateToUserProfile}> {userName} </Button> 
					
							<Button variant="*" className="border-0 p-0    text-start  postTruncate" id={`userProfileNavigationBtn${postID}${userID}`} title={`Go to user profile of ${userID}`} onClick={handleNavigateToUserProfile}> <small>{userID}</small> </Button> 
					 
						</div> 
						
					</div>
			   
	);
	
};

export default memo(PostHeader);
