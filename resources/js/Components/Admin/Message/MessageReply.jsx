 import {useCallback, useState } from "react";

 import  Form  from 'react-bootstrap/Form'; 
 import  Offcanvas  from 'react-bootstrap/Offcanvas'; 
 import  Button  from 'react-bootstrap/Button'; 
import {   BsX  } from 'react-icons/bs'; 
 
const MessageReply = ({ 
	replayToMessage, 
	messageReply, 
 setMessageReply, 
 replySending, 
 replyText, 
 error, 
 setReplyText, 
 setError, 
}) => {
	
 	
	const closeReplyBox = useCallback( ( )=>{
		setMessageReply(null);
		setError('');
	},[]);
  return (
	
		<Offcanvas  placement="bottom"  show={messageReply != null} onHide={closeReplyBox} className="  rounded  comment_box_main_Container mx-auto   "  >
			<Offcanvas.Header className="   d-flex flex-wrap justify-content-between border-bottom" >
				<Offcanvas.Title>Message</Offcanvas.Title>
					<Button  
						variant="outline-dark" 
						onClick={closeReplyBox}
						className=" p-1  border border-2 border-dark  " 
						id="closeShowUserListBTN" 
						title="Close user list"  
					>
						<BsX className="  fw-bold fs-3 " />
					</Button>
				
				</Offcanvas.Header>  
				
				<Offcanvas.Body className=""   > 
				{messageReply && 
					<>
            {/* Display user info - not inside the form */}
            <div className="mb-4">
              <div className="mb-2">
                <strong className="text-dark  d-block">Name:</strong>
                <div className="text-muted">{messageReply.name}</div>
              </div>

              <div className="mb-2">
                <strong className="text-dark  d-block">Email:</strong>
                <div className="text-muted">{messageReply.email}</div>
              </div>

              <div className="mb-3">
                <strong className="text-dark mb-1 d-block ">User Message:</strong>
                <div
                  className=" p-2 p-md-3 rounded bg-body-secondary small overflow-auto"
                  style={{
                    maxHeight: '150px', 
                  }}
                >
                  {messageReply.message}
                </div>
              </div>
            </div>

						<Form noValidate onSubmit={replayToMessage} autoComplete="off"> 
							
							<Form.Group controlId="replyText" className="mb-3">
								<Form.Label className=" text-dark fw-bold">Your Reply</Form.Label>
								<Form.Control
									as="textarea"
									rows={5}
									placeholder="Type your reply here..."
									className="formInput"
									value={replyText}
									onChange={(e) => setReplyText(e.target.value)}
									isInvalid={!!error}
								/>
								<Form.Control.Feedback type="invalid">
									{error}
								</Form.Control.Feedback>
							</Form.Group>
							
							
							<Button variant="dark" type="submit" className="w-100 mt-3  " title="submit reply" id="replyFormSubmitButton" disabled={replySending}>
							{replySending ? 'Sending' : 'Send'}
							</Button>
									 
								
						</Form>
						
					</>	
				}
					
				</Offcanvas.Body> 
		</Offcanvas>
	 
  );
};

export default MessageReply;
