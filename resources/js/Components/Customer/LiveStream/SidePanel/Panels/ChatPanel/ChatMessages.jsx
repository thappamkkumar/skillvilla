
import {memo} from 'react';
import { useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button'; 

import handleImageError from '../../../../../../CustomHook/handleImageError'; 

const ChatMessages= () => {
	const liveStreamData = useSelector((state) => state.liveStreamData);
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));

	const messages = liveStreamData.chatMessages.length > 0 ? liveStreamData.chatMessages : [
		{
			id:1,
			message:'hello',
			live_stream_id:3,
			sender_id: 1,
			sender: {
				id:1,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
		{
				id:2,
			message:'werwe rewrew',
			live_stream_id:3,
			sender_id: 1,
			sender: {
				id:1,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
		{
				id:3,
			message:'ewrew rewrew ew rewre wrew ewrew rewrew ewrew rewrew',
			live_stream_id:3,
			sender_id: 1,
			sender: {
				id:1,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
		{
				id:4,
			message:'ewrew rewrew ew rewre wrew ewrew rewrew ewrew rewrew',
			live_stream_id:3,
			sender_id: 21,
			sender: {
				id:21,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
		
		
		{
			id:5,
			message:'hello',
			live_stream_id:3,
			sender_id: 1,
			sender: {
				id:1,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
		{
				id:6,
			message:'werwe rewrew',
			live_stream_id:3,
			sender_id: 1,
			sender: {
				id:1,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
		{
				id:7,
			message:'ewrew rewrew ew rewre wrew ewrew rewrew ewrew rewrew',
			live_stream_id:3,
			sender_id: 1,
			sender: {
				id:1,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
		{
				id:8,
			message:'ewrew rewrew ew rewre wrew ewrew rewrew ewrew rewrew',
			live_stream_id:3,
			sender_id: 21,
			sender: {
				id:21,
				userID: 'adasdasd', 
				customer: {
					id:2, 
					user_id:1, 
					image:'image1.png',
				}
			}
		},
	
	];
	
	 
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

