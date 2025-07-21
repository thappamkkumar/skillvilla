	 
import React, {memo, useCallback,  useState, useEffect  }  from "react";  
import { useNavigate } from 'react-router-dom';
import {useSelector } from 'react-redux';  
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button'; 
import Badge from 'react-bootstrap/Badge'; 
 
//import PostHeader from '../../Post/PostHeader'; 

import MessageText from '../../../Common/MessageText';
import PostDate from '../../Post/PostDate';   
import handleImageError from '../../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl'; 
  
const Comment  = ({comment}) =>
{	  
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	 
	
	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
	 
		if(logedUserData.id == comment.user.id )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
		//	manageVisitedUrl(`/user/${comment.user.userID}/${comment.user.id}/profile`, 'append');
			navigate(`/user/${comment.user.userId}/${comment.user.id}/profile`);
		}
			
	}, []);
	
	
	return(
		 
			<div className="w-100   px-2 pb-2  border-bottom RelativeContainer" style={{ backgroundColor: comment.new != null && comment.new === true ? 'rgba(240,250,240,1)' : 'transparent' }} >
					{ 
						(comment.new != null && comment.new === true )
						&& 
						<Badge className=" bg-success" 
								style={{position:'absolute', top:'10px', right:'10px'}}
						bg="secondary">New</Badge>

					}
					 
				 
					<div className=" w-100  h-auto  px-2 py-2 d-flex flex-wrap   align-items-center">
						<div className="btn p-0 border-0   " onClick={handleNavigateToUserProfile} > 
							<Image src={comment?.user?.customer?.image || '/images/login_icon.png'} className="comment_profile_image  " onError={()=>{handleImageError(event, '/images/login_icon.png')} } alt={`profile image of ${comment.user.userID}`}/> 
						</div>
						<div className="btn p-0 border-0  fw-bold" >
							
							<Button variant="*" className="border-0 fw-bold" id={`${comment.user.userID}-ProfileNavigationBtn`} title={`Go to user profile ${comment.user.userID}`} onClick={handleNavigateToUserProfile}> {comment.user.userID} </Button> 
						</div> 
						
					</div>
					 
					<div className="  px-2 py-0 m-0  w-100"> 
						<MessageText text={comment.comment} id={comment.id} />
					</div>
					<PostDate  postDate={comment.created_at_human_readable}/> 
							
					 
						
        </div>
		 
	);
};

export default memo(Comment);
