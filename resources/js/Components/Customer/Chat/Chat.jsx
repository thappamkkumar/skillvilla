
import {useState, useEffect, useCallback, memo} from 'react'; 
import { useSelector, useDispatch } from 'react-redux';   
import {useNavigate} from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';
import Badge from 'react-bootstrap/Badge'; 
import Button from 'react-bootstrap/Button';

import { BsLink45Deg } from "react-icons/bs";

import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
 
import handleImageError from '../../../CustomHook/handleImageError';
import useIsSmallScreen from '../../../CustomHook/useIsSmallScreen'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const Chat = ({chat, chatId}) => {
	const isSmallScreen = useIsSmallScreen();//custom hook for check the screen width	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	 
 
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info  
	   
	
	//function to set current url into session
		const handleNavigateToChatBox = useCallback(() =>
		{  
			//call function to add current url into array of visited url
			let url =  '';
			if(isSmallScreen) 
			{
				url =   `/chat/${chat.id}` ;
				//manageVisitedUrl(url, 'append'); 
			}
			else
			{
				 
				url =  `/chats/${chat.id}`;
				//manageVisitedUrl(url, 'addNew');
			}
			 
			 
			dispatch(updateChatMessageState({type : 'refresh'})); 
				
			navigate(url);
		}, [isSmallScreen,  chat]);
	
  return (
    <ListGroup.Item  action variant="outline-light" onClick={handleNavigateToChatBox} id={`chat_${chat.id}`}  className={` rounded-0 border-0  py-3 customListGroup ${chatId != null && chatId == chat.id && 'active'}`}  >
								
			<div className={` w-100  h-auto RelativeContainer d-flex justify-content-start align-items-${chat.latest_message != null ? 'center' : 'start'}`}>
				<div className=" "  > 
					<Image src={chat?.chat_partner?.customer?.image || '/images/login_icon.png'} className="profile_img " onError={()=>{handleImageError(event, '/images/login_icon.png')} } alt={`profile image of ${chat.userID}`}  /> 
				</div>
				<div className=" ps-3  postTruncate" >
						<strong className="d-block fw-bold postTruncate">{chat.chat_partner.name}</strong>
						
						{/*attachment*/}
						{
							chat.latest_message != null && chat.latest_message.message == null &&
							 <small  >{chat.latest_message.attachment}</small>
						}
						{/*message*/}
						{
							chat.latest_message != null && chat.latest_message.message != null &&
							 <small  >{chat.latest_message.message}</small>
						}

						 
						{/*post*/}
						{
							chat.latest_message != null && chat.latest_message.post_id != null &&
							<small className=" lh-1" > 
								<BsLink45Deg /> Post
							</small>
						}
						{/*workfolio*/}
						{
							chat.latest_message != null && chat.latest_message.workfolio_id != null &&
							<small className=" lh-1" > 
								<BsLink45Deg /> Workfolio
							</small>
						}
						{/*problem*/}
						{
							chat.latest_message != null && chat.latest_message.problem_id != null &&
							<small className=" lh-1" > 
								<BsLink45Deg /> Problem
							</small>
						}
						{/*job*/}
						{
							chat.latest_message != null && chat.latest_message.company_job_id != null &&
							<small className=" lh-1" > 
								<BsLink45Deg /> Job vacancy
							</small>
						}
						{/*freelance*/}
						{
							chat.latest_message != null && chat.latest_message.freelance_id != null &&
							<small className=" lh-1" > 
								<BsLink45Deg /> Freelance work
							</small>
						}
						{/*stories*/}
						{
							chat.latest_message != null && chat.latest_message.stories_id != null &&
							<small className=" lh-1" > 
								<BsLink45Deg /> Story
							</small>
						}
						{/*community*/}
						{
							chat.latest_message != null && chat.latest_message.community_id != null &&
							<small className=" lh-1" > 
								<BsLink45Deg /> Community Profile
							</small>
						}
						{/*user*/}
						{
							chat.latest_message != null && chat.latest_message.user_id != null &&
							<small className="lh-1" > 
								<BsLink45Deg /> User Profile
							</small>
						}
						 
						 
				</div>
				{
				chat.latest_message != null && chat.latest_message.is_read == false && logedUserData.id != chat.latest_message.sender_id && 
				<Badge bg="danger" className="badge_chatList">New</Badge>
			}
			</div>
			
			
		</ListGroup.Item>
  );
};

export default  memo(Chat);
