
import {memo, useState,useRef, useCallback} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'; 
import { BsFillSendFill  } from "react-icons/bs";

import MessageAlert from '../../../../../MessageAlert';

import serverConnection from '../../../../../../CustomHook/serverConnection'; 

import {updateLiveStreamState} from '../../../../../../StoreWrapper/Slice/LiveStreamSlice';

const ChatMessageInput = () => {
	const liveStreamData = useSelector((state) => state.liveStreamData);
	//const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message 

	const [submitting, setSubmitting] = useState(false);
	const textareaRef = useRef(null); // Reference to the textarea element


	const dispatch = useDispatch();	
	

	 const handleSendMessage = useCallback(async(event) => 
	{
			event.preventDefault();
			try
			{
				let message = event.target.message.value.trim();
				  
				if (message == '' && file == null) 
				{
					return false;  
				}
				setSubmitting(true);
				const formData = { 
					message: message, 
					liveStreamId : liveStreamData.liveId,
				}  
				const result = await serverConnection('/live-stream-massage-send', formData, authToken ); 
				
				//console.log(result);
				if(result?.status == true)
				{   

						
						dispatch(updateLiveStreamState(
							{ 
								type:'newMessage', 
								data:{
									messageId: result.newMessage.id ,
									liveId: result.newMessage.live_stream_id ,
									newMessage: result.newMessage.message ,
									senderId: result.newMessage.sender_id ,
									sender: result.newMessage?.sender || {} ,
								}
							}
						));
						
						event.target.message.value=null; 
						const textarea = textareaRef.current;
						textarea.style.height = 'auto'; // Reset the height
		
				}
				else
				{
					setsubmitionMSG(result?.message || 'Failed to send message. Please try again.');
					setShowModel(true); 
				}
			
			} 
			catch(e) 
			{
				setsubmitionMSG('An error occurred. Please try again.');
				//console.log('error:- ' + e);
				setShowModel(true);
				 
			}
			finally
			{
				setSubmitting(false);
			}
		},[liveStreamData, setSubmitting, authToken]
	);
	
	// Function to handle input change and resize the textarea
  const handleInput = (event) => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset the height
		const newHeight = Math.min(textarea.scrollHeight, 200); // Set height based on content, but not more than 200px
    textarea.style.height = `${newHeight}px`; // Apply the height
	};
	
	
	return( 
			 
			<div className="w-100      bg-secondary-subtle p-2   ">
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>  
			 <Form onSubmit={handleSendMessage}>
					<div className="w-100 d-flex justify-content-start align-items-end		">
				
						{/* Message Input Field */}
						<Form.Group controlId="newMessageFeild" className="flex-grow-1 me-1   ">
							<Form.Control
								as="textarea" rows={1} 
								ref={textareaRef} 
								onInput={handleInput}  
								className="shadow-none  rounded-0 border-0 chatBox_messageInput "
								name="message"
								autoComplete="off"
								placeholder="Type your message..."
								 
								readOnly={submitting}  
							/>
						</Form.Group>

						{/* Send Button */}
						<Button
							variant="dark"
							type="submit"
							title="Send Message"
							id="newMessageSubmitBTN" 
							disabled={submitting}  
						>
							{submitting ? (
								<Spinner animation="border" size="sm" />
							) : (
								<BsFillSendFill  className="fs-5"/>
							)}
						</Button>
					</div>
				</Form>
			</div>
			
	);
}

export default memo(ChatMessageInput);