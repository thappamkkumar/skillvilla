
import {memo, useCallback} from 'react';
import { useSelector } from 'react-redux';
import { useNavigate  } from "react-router-dom";
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button'; 

import handleImageError from '../../../../../../CustomHook/handleImageError'; 

const ChatMessages= () => {
	const liveStreamData = useSelector((state) => state.liveStreamData);
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));

  const navigate = useNavigate();
	
	
	const messages =   liveStreamData.chatMessages ;
	
	
	const navigateToSenderProfile = useCallback((ID,userID)=>{
		const url = logedUserData.id == ID ? '/profile' : `/user/${userID}/${ID}/profile` ;
		navigate(url); 
		
	},[]);
	
	return( 
		<div className="flex-grow-1  h-100 overflow-auto ">
		 	<div className="  py-4  d-flex flex-column justify-content-end ">{/*use justify-content-end   for reverse rendering. mean onload  div start from bottom not from top */}
			 	{
				messages.map((message)=> (
					<div 
						key={message.id}
						className={`p-2 d-flex ${message.sender_id === logedUserData.id ? 'justify-content-end' : 'justify-content-start'}`}
					>
						<div 
							className={`  ${message.sender_id === logedUserData.id ? '  bg-opacity-50' : ' bg-opacity-25'}   bg-secondary   rounded   py-3 px-3`}
							style={{maxWidth:'80%', minWidth:'50%',   }}
						>
						
							<p className="mb-0 text-light">{message.message}</p>
							
							{
								message.sender_id !== logedUserData.id &&
								<div className="d-flex justify-content-end align-items-center">
									<Button
										variant="outline-secondary"
										id={`senderProfileLink${message?.sender?.userID}${message?.id}`}
										title="Sender Profile"
										className="d-flex justify-content-start align-items-center gap-1 border-0 text-white-50 rounded-1 p-1 overflow-hidden "
										onClick={()=>{navigateToSenderProfile(message?.sender?.id, message?.sender?.userID)}}
									>
										<Image
											src={message?.sender?.customer?.image || '/images/login_icon.png'}
											className="comment_profile_image "
											onError={(event) => handleImageError(event, '/images/login_icon.png')}
											alt={`profile image of ${message?.sender?.name}`}
											 
										/>
										<strong className=" text-truncate  small">
										{message?.sender?.userID}  
										</strong> 
									</Button>
								</div>
							}
						</div>
					</div>
				 ))
			}
			</div> 
		</div> 
		 
	);

};
export default memo(ChatMessages);

