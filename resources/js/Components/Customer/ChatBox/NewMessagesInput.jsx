import { memo, useState,useRef, useCallback  } from 'react';
import { useSelector } from 'react-redux';
import Spinner from 'react-bootstrap/Spinner';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import { BsFillSendFill, BsPaperclip, BsX } from "react-icons/bs";

import serverConnection from '../../../CustomHook/serverConnection'; 

const NewMessagesInput = ({ chatId, addNewMessageToChat }) => {
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
  const [submitting, setSubmitting] = useState(false);
	const [attachmentFile, setAttachmentFile] = useState('');
	const textareaRef = useRef(null); // Reference to the textarea element
	const fileInputRef = useRef(null); // Create a ref for the file input
  
	// Handle submitting new message
  const handleSendMessage = useCallback(async(event) => 
	{
			event.preventDefault();
			try
			{
				let message = event.target.message.value.trim();
				let file = event.target.attachment.files[0];
				 
				if (message == '' && file == null) 
				{
					return false;  
				}
				setSubmitting(true);
				const formData = { 
					message: message,
					attachment: file,
					chatId : chatId
				}
				let contentType = 'multipart/form-data'; 
				const resultData = await serverConnection('/upload-new-message', formData, authToken, contentType ); 
				
				//console.log(resultData);
				if(resultData.status == true)
				{   
						event.target.message.value=null;
						event.target.attachment.value = null;
						setAttachmentFile('');
						
						if(resultData.newMessage)
						{
							addNewMessageToChat(resultData.newMessage);
						}
						 
						const textarea = textareaRef.current;
						textarea.style.height = 'auto'; // Reset the height
		
				}
				setSubmitting(false);
			} catch (e) {
				//console.log(e);
				setSubmitting(false);
			}
		},[chatId, setSubmitting, authToken]
	);
	
	
	// Function to handle input change and resize the textarea
  const handleInput = (event) => {
    const textarea = textareaRef.current;
    textarea.style.height = 'auto'; // Reset the height
		const newHeight = Math.min(textarea.scrollHeight, 200); // Set height based on content, but not more than 200px
    textarea.style.height = `${newHeight}px`; // Apply the height
	};
	
	//function use to handle file change
	const handleFileChange = (e) => {
	  const file = event.target.files[0];
    if (file) {
      setAttachmentFile(file.name); // Update the state with the file name
    } else {
      setFileName(''); // Clear the file name if no file is selected
    }
  
  };
	//function use to cancle selected file
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = null; // Reset the file input value
    }
    setAttachmentFile(''); // Reset the file name in state
  };
		
		
		
  return (
    <div className="mx-auto p-2 rounded  chatBox_footer_formContainer ">
			{	attachmentFile && 
				<>
					<strong className="pe-2">Selected file:- </strong> 
					<div className="border border-2 mx-1 my-1 p-1 px-2   rounded  d-inline-flex align-items-center">
						<span className="pe-2 d-inline-block  postTruncate">{attachmentFile}</span>
						<Button variant="danger" title="remove technology or skill" id="newMsgRemoveTechSkillBTN" className="p-0  "  onClick={handleAttachmentClick} >
							<BsX className="fs-3" />
						</Button>
						
					</div>
				</>
			}
     
		 <Form onSubmit={handleSendMessage}>
        <div className="d-flex align-items-end">
          {/* Attachment Button */}
          <Form.Group controlId="newMessageAttachmentFeild" className="me-1   "  >
						 <Form.Label    className=" m-0 px-1 btn btn-light  " onClick={handleAttachmentClick}> 
                <BsPaperclip />               
            </Form.Label>
            <Form.Control type={`${submitting ?'hidden':'file'}`} className="d-none" name="attachment"  ref={fileInputRef}  onChange={handleFileChange} readOnly={submitting}  />
          </Form.Group>

          {/* Message Input Field */}
          <Form.Group controlId="newMessageFeild" className="flex-grow-1 me-1  ">
            <Form.Control
							as="textarea" rows={1} 
							ref={textareaRef} 
							onInput={handleInput}  
              className="shadow-none  rounded-0 border-0    chatBox_messageInput "
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
};

export default memo(NewMessagesInput);
