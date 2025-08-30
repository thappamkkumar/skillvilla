import {useState,  useCallback, useRef, memo, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';  
import { useParams } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'; 
import Button from 'react-bootstrap/Button'; 
import Card from 'react-bootstrap/Card';  

import { BsArrowDown} from "react-icons/bs";

import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';

import ChatBoxHeader from '../../../Components/Customer/ChatBox/ChatBoxHeader';
import Messages from '../../../Components/Customer/ChatBox/Messages';
import NewMessagesInput from '../../../Components/Customer/ChatBox/NewMessagesInput';  
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data 


import useFetchMessages from './ChatBoxFunction/useFetchMessages'
import useHandleScrollPosition from './ChatBoxFunction/useHandleScrollPosition'
 
import useUpdateMessageReadStatusWebsocket from '../../../Websockets/Chat/useUpdateMessageReadStatusWebsocket'; 
import useSendNewMessageWebsocket from '../../../Websockets/Chat/useSendNewMessageWebsocket'; 
import useChatDeleteWebsocket from '../../../Websockets/Chat/useChatDeleteWebsocket'; 
 

const ChatBoxPage = () => {
	const { chatId } = useParams(); 
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const messageList = useSelector((state) => state.messageList); //selecting chat message List from store
	const chatList = useSelector((state) => state.chatList); //selecting chat List from store
  const [loading, setLoading] = useState(false);
  const [showScrollDownBTN, setShowScrollDownBTN] = useState(false);
  const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	  
	
	const scrollRef = useRef(null);
	const firstRender = useRef(0);
	const newMessages = useRef(false);
	 
	
	//call separate  function that handle fetching messages
	useFetchMessages(chatId, scrollRef, loading, setLoading,  dispatch, authToken, messageList );
	
		//call separate  function that handle scroll positions
	useHandleScrollPosition(firstRender, showScrollDownBTN, setShowScrollDownBTN, newMessages, messageList, scrollRef, chatId, dispatch );
	
	
	// Call the  hook for websockets event listeners
	useUpdateMessageReadStatusWebsocket(chatId, logedUserData); 
	
	useSendNewMessageWebsocket(  logedUserData, chatList, authToken, true, chatId, setShowScrollDownBTN);
	
	useChatDeleteWebsocket(  logedUserData, true, chatId);
	 	   
	 
	
	//function use to add new message in chat for logged user. who send message-read-status`
	const addNewMessageToChat = useCallback((message)=>	{
		if(logedUserData.id == message.sender_id)
		{  
			newMessages.current = true;
			//add new mesage in chat list
			dispatch(updateChatState({type : 'AddNewMessage',  message:message } ));  
			//move chat at top of list
			dispatch(updateChatState({type : 'updateChatAndMoveToTop',  chatId:message.chat_list_id } ));  
			//add message in message list 
			dispatch(updateChatMessageState({type : 'AddNewMessage', newMessage:message}));
		}
	},[logedUserData,      ]);
	
	
	
	//function use to scroll to bottom on button click
 	const scrollToBottom = useCallback(() => {
		if (scrollRef.current) 
		{
			const scrollHeight = scrollRef.current.scrollHeight;
			const clientHeight = scrollRef.current.clientHeight;
			const targetScrollPosition = scrollHeight - clientHeight;  
			scrollRef.current.scrollTop = targetScrollPosition; 
		}
	}, []);   

 
 //set scroll down button hidden on inital load
 useEffect(()=>{
	 setShowScrollDownBTN(false);
 },[chatId]);
	  
	
	/*if(messageList.chatUser == null && !loading)
	{
		return(
			<div className="w-100 h-100 d-flex justify-content-center align-items-center">
				<h4 className="text-center">Chat is not found or deleted.</h4>
			</div>
		);
	}*/
	
  return (
    <>
      
			<PageSeo 
				title={messageList?.chatUser?.name ? `Chat with ${messageList.chatUser.name} | SkillVilla` : 'Chatbox | SkillVilla'}
				description={messageList?.chatUser?.name ? `Engage in a private conversation with ${messageList.chatUser.name} on SkillVilla.` : 'Start a new private conversation on SkillVilla.'}
				keywords={messageList?.chatUser?.name ? `chat, private conversation, ${messageList.chatUser.name}, SkillVilla messaging` : 'chat, private conversation, SkillVilla messaging'}
			/>

			 
			<Card    className="w-100 h-100  border-0   overflow-hidden  p-0 rounded-0  ">
				{/* Chatbox Header */}
				<Card.Header className={` ${messageList.chatUser == null && 'p-0'} p-0 chatBox_header rounded-0  border `}>
					{
						messageList.chatUser != null && 
						<ChatBoxHeader user={messageList.chatUser} chatId={chatId} />
					}
				</Card.Header>

				{/* Chat Messages */}
				<Card.Body ref={scrollRef} className="chatBox_body   pt-0 px-0  overflow-auto RelativeContainer  " >
						{
							messageList.chatUser == null &&  !loading &&
							<div className="w-100 h-100 d-flex justify-content-center align-items-center">
								<h4 className="text-center">Chat is not found or deleted.</h4>
							</div>
						}
				 
						{
							 loading &&
											<div className="py-4 w-100 h-auto text-center">
												<Spinner animation="border" size="md" />
											</div>
						}
						{
							Object.keys(messageList.messageList).length == 0 && !loading &&
								<div className="w-100 h-100 d-flex justify-content-center align-items-center">
									<h4 className="text-center">Start a new conversation to connect and collaborate effectively.</h4>
								</div>
						}
						{
							Object.keys(messageList.messageList).length > 0 &&
							<Messages messages={messageList.messageList}/>
						}											
							
						{
							showScrollDownBTN &&
							<Button variant="light"
							className=" z-2  chatScrolDownBTN" 
							id="scrolDownBTNID"
							title="Scroll Down"
							 onClick={scrollToBottom}
							>
								<BsArrowDown style={{ strokeWidth: '1',  }} />
							</Button>
						}
							 
						 
				</Card.Body>

				{/* Input Field */}
				<Card.Footer   className="chatBox_footer border-0 p-2 w-100  "  	>
					{
						messageList.chatUser != null && 
				
						<NewMessagesInput chatId={chatId} addNewMessageToChat={addNewMessageToChat}/>
					}
				</Card.Footer>
			</Card>
		
							 
							
      
			
    </>
  );
};

export default memo(ChatBoxPage);
