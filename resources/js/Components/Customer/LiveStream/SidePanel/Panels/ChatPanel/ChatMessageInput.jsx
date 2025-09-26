
import {memo, useState,useRef, useCallback} from 'react';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'; 
import { BsFillSendFill  } from "react-icons/bs";


import serverConnection from '../../../../../../CustomHook/serverConnection'; 

const ChatMessageInput = () => {
	const liveStreamData = useSelector((state) => state.liveStreamData);
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [submitting, setSubmitting] = useState(false);
	const textareaRef = useRef(null); // Reference to the textarea element

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
				const resultData = await serverConnection('/live-stream-massage-send', formData, authToken ); 
				
				console.log(resultData);
				if(resultData?.status == true)
				{   
						event.target.message.value=null;
						 
						 
						const textarea = textareaRef.current;
						textarea.style.height = 'auto'; // Reset the height
		
				}
			
			} 
			catch (e) 
			{
				alert('error');
				console.log(e);
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