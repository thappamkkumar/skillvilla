import {useCallback, useState} from "react";
import {  useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Table  from "react-bootstrap/Table";
import Button  from "react-bootstrap/Button"; 
import Dropdown  from "react-bootstrap/Dropdown"; 
 
import { BsThreeDotsVertical, BsTrash3, BsCardText,  } from "react-icons/bs";
 
import MessageReply from './MessageReply';
import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';  

import {updateListState} from '../../../StoreWrapper/Slice/Admin/AdminListSlice';
 
const MessageTable = ({ messages }) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false); 
	const [deleteMessageId, setDeleteMessageId] = useState(null); 
	const [messageReply, setMessageReply] = useState(null); 
	const [replySending, setReplySending] = useState(false); 
	const [replyText, setReplyText] = useState('');
  const [error, setError] = useState('');
 
	const navigate = useNavigate(); 
	const dispatch = useDispatch();
	
	 

	//function for open reply 
	
	const openReplyBox = useCallback( (messageId,  email, name, message)=>{
		setMessageReply({
				message_id: messageId,
				name: name,
				email: email,
				message: message,
			});
	},[]);
	 
	
	
	//function for reply to message
	const replayToMessage = useCallback(async(e)=>{
		e.preventDefault();
		if(messageReply == null || authToken == null)
		{
			return;
		}
		
		if (!replyText.trim()) 
		{
			setError("Reply cannot be empty.");
			return;
		}
		setError('');
		
		try
		{ 
			
    
			setReplySending(true);
			const messageData = {
				reply: replyText,
				email: messageReply.email,
				name: messageReply.name,
				messageId: messageReply.message_id,
			};
			 
			//call the   server
			 let data = await serverConnection('/admin/send-reply-to-user-message', messageData, authToken);
			 //console.log(data);
			 if(data && data.status)
			 {
				 setReplyText('');
				  setsubmitionMSG(`Reply is send on mail "${messageData.email}" .`); 
			 }
				else
				{
					 setsubmitionMSG('Failed to send reply. Please try again'); 
				}
			
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.'); 
		}
		finally
		{ 
			setReplySending(false)
			setShowModel(true)
		}	   
		
	}, [messageReply, authToken, replyText]);
	 
	
	//delete message
	const handleDeleteMessage= useCallback(async()=>{
		setShowConfirm(false);
		if(deleteMessageId == null || authToken == null)
		{
			return;
		}
		try
		{ 
			//call the   server
			let data = await serverConnection('/admin/delete-user-message', {id:deleteMessageId}, authToken);
			//console.log(data);
			 
			if(data.status)
			{ 
				dispatch(updateListState({type : 'ItemDelete', deleted_id: deleteMessageId}));
				setsubmitionMSG('Message is deleted successfully.');
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the message. Please try again.');
			}
			 
		}
		catch(error)
		{
			//console.log(error);
			 setsubmitionMSG( 'An error occurred. Please try again.'); 
		}
		finally
		{
			setDeleteMessageId(null); 
			setShowModel(true)
		}
		 
	}, [authToken, deleteMessageId, setDeleteMessageId]);
	
	 
	
  return ( 
		<div className="mt-4 mb-4 sub_main_container p-2 overflow-auto " style={{minHeight:'40vh'}} >
        <Table   bordered     variant="white" className="  m-0    text-center">
          <thead className="table-secondary">
            <tr>
              <th>S.No</th> 
              <th>Name</th>
              <th>Email</th> 
              <th>Message</th>
              <th>Date</th> 
              <th>Time</th> 
              <th>More</th>
            </tr>
          </thead>
          <tbody>
            {messages && messages.length > 0 ? (
              messages.map((message, index) => (
                <tr key={index}>
                  <td>{index+1}</td>
                  <td className="overflow-hidden "> 
										{message.name} 
									</td>
									<td className="overflow-hidden "> 
										{message.email} 
									</td>
									<td className="overflow-hidden "> 
										<p className="my-0 text-truncate mx-auto " style={{maxWidth:'300px',}}> 
											{message.message} 
										</p>
									</td>
									<td className="overflow-hidden "> 
										{message.formated_date} 
									</td>
									<td className="overflow-hidden "> 
										{message.formated_time} 
									</td>
									 
                   
									<td>
									
										<Dropdown className="   "> 
										 
											<Dropdown.Toggle variant="*" id={`userAction${message.id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
														<BsThreeDotsVertical />
												</Dropdown.Toggle> 
						 
											<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}> 
														 
												<Dropdown.Item as="button" variant="*" id={`messageReply${message.id}`} title={`Full message  "${message.id}"`}  className="py-2 mb-2 d-flex align-items-center gap-2   rounded navigation_link" onClick={()=>openReplyBox(message.id, message.email, message.name,  message.message)}>
													<BsCardText /> <span className="px-2">Full Message </span>	
												</Dropdown.Item>
												
												<Dropdown.Item as="button" variant="*" id={`deleteMessage${message.id}`} title={`Delete message "${message.id}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={
													() => {setDeleteMessageId(message.id); setShowConfirm(true); }
													
													}>
													<BsTrash3 /> <span className="px-2">Delete </span>	
												</Dropdown.Item>
													 
											</Dropdown.Menu>
										</Dropdown>
										
                     
                     
										 
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-4 fw-bold text-danger">No message found!</td>
              </tr>
            )}
          </tbody>
        </Table>
				
				<MessageReply 
				replayToMessage={replayToMessage} 
				messageReply={messageReply} 
				setMessageReply={setMessageReply}
				replySending={replySending}
				replyText={replyText}
				error={error}
				setReplyText={setReplyText}
				setError={setError}
				
				/>
				
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteMessage}
        message="Are you sure you want to delete this message."
        confirmLabel="Delete"
				/>
      </div>
    
  );
};

export default MessageTable;
