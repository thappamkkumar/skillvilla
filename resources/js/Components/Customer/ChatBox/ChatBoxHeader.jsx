import {memo, useEffect, useState, useCallback} from 'react';   
import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux';  
import Image from 'react-bootstrap/Image';
import Button from 'react-bootstrap/Button'; 
import {    BsCameraVideoFill, BsTelephoneFill   } from 'react-icons/bs';

import MessageAlert from '../../../Components/MessageAlert';
 
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';  
import handleImageError from '../../../CustomHook/handleImageError';  
	



const ChatBoxHeader = ({user, chatId}) => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from stor
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const chatCallData =  useSelector((state) => state.chatCallData);//get call info 
	
  const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();
	 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	
	
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
	
 
	

	const handleAubioCall = useCallback(async()=>{
		try
		{
			if(chatCallData.callStatus === 'calling')
			{
				setsubmitionMSG("You're already trying to call someone. Please wait for them to answer.");
				setShowModel(true);
			}
			if(chatCallData.callStatus === 'in-call')
			{
				setsubmitionMSG("You're already in a call. Please end the current call to start a new one.");
				setShowModel(true);
			}
			
			const resultData = await serverConnection('/initiate-call', 
			{'receiver_id': user.id, 'call_type':'audio', 'chat_id': chatId}, 
			authToken   ); 
			
			//console.log(resultData);
			if(resultData?.status )
			{
				let initiatingCallData = {
					callId : resultData?.callData.id || null,
					callStatus : 'calling',
					callType : resultData?.callData.call_type || null,
					receiver : resultData?.callData?.receiver || null,
					caller : resultData?.callData?.caller || null,
					callRoomId : resultData?.callData?.room_id || null,
					 
				};
				
				  
				dispatch(updateChatCallState({'type' : 'initiatingCall', 'initiatingCall': initiatingCallData})); 
			}
			else
			{
				setsubmitionMSG(resultData.message || 'An error occurred. Please try again.');
				setShowModel(true);
			}
		}
		catch(e)
		{
			//console.log(e);
			setsubmitionMSG('An error occurred. Please try again.');
			setShowModel(true);
		}
		
	}, [authToken, chatId, user.id, chatCallData.callStatus]);
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
			
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
		</>
  );
};

export default memo(ChatBoxHeader);
