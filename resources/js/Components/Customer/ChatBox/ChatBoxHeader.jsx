import {memo, useEffect, useState, useCallback} from 'react';   
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux';  
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button'; 
import {    BsCameraVideoFill, BsTelephoneFill   } from 'react-icons/bs';

 
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
 
import handleImageError from '../../../CustomHook/handleImageError';  
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
 



const ChatBoxHeader = ({user, chatId}) => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from stor
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
  const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();
	 

	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
		
		dispatch(updateChatMessageState({type : 'refresh'})); 
		
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
			
	}, []);
	
 
	

	const handleAubioCall = useCallback(()=>{alert("AUDIO CALL");}, []);
	const handleVedioCall = useCallback(()=>{alert("VEDIO CALL");}, []);
  return (
		<>
		 		
				
			<div className="  px-2 py-1   h-auto     d-flex justify-content-between align-items-center " >
				<div className="d-flex align-items-center overflow-hidden ps-1 py-1   ">
					<div className="btn  p-0 border-0 "  onClick={handleNavigateToUserProfile}> 
						<Image src={user?.customer?.image ||  '/images/login_icon.png'} className="profile_img  " onError={()=>{handleImageError(event, '/images/login_icon.png')} } alt={`profile image of ${user.userID}`}  /> 
						
					</div>
					<div className=" p-0  ps-2   btn text-start  border-0 text-truncate" onClick={handleNavigateToUserProfile}>
							<strong className="d-block fw-semibold fs-6 text-truncate  ">{user.name}  </strong>
							 <small className="d-block text-truncate ">{user.userID}</small>
							 
										 
							
					</div>
				</div>
				<div className=" d-flex align-items-center  ps-2 " >
						 <Button  variant="light"  title="Audio Call"  id="audioCallBTN" className="  border-0 shadow-none  me-1 p-2 lh-1 audioVedioCallBTN  " onClick={handleAubioCall} > 
							<BsTelephoneFill    />
						 </Button>
						 <Button  variant="light"  title="Vedio Call"  id="vedioCallBTN" className="  border-0 shadow-none   me-1 p-2 lh-1 audioVedioCallBTN "	onClick={handleVedioCall}> 
								 <BsCameraVideoFill   />
						 </Button>
			 
					</div>
			</div>
		</>
  );
};

export default memo(ChatBoxHeader);
