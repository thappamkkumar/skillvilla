import {useState,  useCallback, useRef, memo, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';  
import { useParams } from "react-router-dom";
import Spinner from 'react-bootstrap/Spinner'; 
import Button from 'react-bootstrap/Button'; 
import Card from 'react-bootstrap/Card';  
 
import { BsArrowDown} from "react-icons/bs"; 

import CommunityMessageInput from '../../../Components/Customer/CommunityChatBox/CommunityMessageInput';  
import CommunityChatBoxHeader from '../../../Components/Customer/CommunityChatBox/CommunityChatBoxHeader';  
import CommunityMessages from '../../../Components/Customer/CommunityChatBox/CommunityMessages';  
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



import useFetchMessages from './CommunityChatFunctions/useFetchMessages'
import useHandleScrollPosition from './CommunityChatFunctions/useHandleScrollPosition'


import {updateCommunityMessageState} from '../../../StoreWrapper/Slice/CommunityMessageSlice';


//import useCommunityNewMessageWebsocket from '../../../Websockets/Community/useCommunityNewMessageWebsocket'; 
 

const CommunityChatBoxPage = () => {
	const { communityId } = useParams(); 
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const messageList = useSelector((state) => state.communityMessageList); //selecting chat message List from store
	 
	const [loading, setLoading] = useState(false);
	const [showScrollDownBTN, setShowScrollDownBTN] = useState(false);
  const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	const scrollRef = useRef(null);
	const firstRender = useRef(0);
	const newMessages = useRef(false);
	
	
	// Call the  hook for websockets event listeners
	/*useCommunityNewMessageWebsocket( 
		communityId,
		logedUserData,  
		setShowScrollDownBTN
	);*/
	
	
	//call separate  function that handle fetching messages
	useFetchMessages(communityId, scrollRef, loading, setLoading,  dispatch, authToken, messageList );
	
	//call separate  function that handle scroll positions
	useHandleScrollPosition(firstRender, showScrollDownBTN, setShowScrollDownBTN, newMessages, messageList, scrollRef, communityId, dispatch );
	
	//function use to add new message in chat for logged user. who send message-read-status`
	const addNewMessageToChat = useCallback((message)=>	{
		if(logedUserData.id == message.sender_id)
		{  
			newMessages.current = true;
			 
			//add new message in community message list 
			dispatch(updateCommunityMessageState({type : 'AddNewMessage', newMessage:message}));
			 
		}
	},[logedUserData,      ]);
	
	//function use to scroll to bottom on button click
 	const scrollToBottom = useCallback(() => {
		if (scrollRef.current) {
			const scrollHeight = scrollRef.current.scrollHeight;
			const clientHeight = scrollRef.current.clientHeight;
			const targetScrollPosition = scrollHeight - clientHeight;
			
			
			scrollRef.current.scrollTop = targetScrollPosition;
				
		}
	}, []);   
	
	//set scroll down button hidden on inital load
 useEffect(()=>{
	 setShowScrollDownBTN(false);
 },[communityId]);
 
	
  return (
    <>
      <PageSeo 
				title={messageList?.communityData?.name ? `${messageList?.communityData.name} - Chat | SkillVilla` : 'Community Chat | SkillVilla'}
				description={messageList?.communityData?.name ? `Engage in conversations with members of the ${messageList?.communityData.name} community on SkillVilla.` : 'Chat with members of your community on SkillVilla.'}
				keywords={messageList?.communityData?.name ? `community chat, ${messageList?.communityData.name}, SkillVilla, community communication` : 'community chat, SkillVilla, messaging, community conversations'}
			/>

							 
			<Card    className="w-100 h-100  border-0   overflow-hidden  p-0 rounded-0  ">
				{/* Chatbox Header */}
				<Card.Header className={` ${messageList.communityData == null && 'p-0'}  p-0 chatBox_header rounded-0  border `}>
					{
						messageList.communityData != null && 
						<CommunityChatBoxHeader communityData={messageList.communityData} communityId={communityId} />
					}
				</Card.Header>

				{/* Chat Messages */}
				<Card.Body ref={scrollRef} className="chatBox_body   pt-0 px-0  overflow-auto RelativeContainer  " >
						
						{
							messageList.communityData == null &&  !loading &&
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
							<CommunityMessages messages={messageList.messageList}/>
						}											
							
						 
						{
							showScrollDownBTN &&
							<Button variant="light"
							className="   chatScrolDownBTN" 
							id="scrolDownBTNID"
							title="Scroll Down"
							 onClick={scrollToBottom}
							>
								<BsArrowDown style={{ strokeWidth: '1',  }} />
							</Button>
						}
							 
						 
				</Card.Body>

				{/* Input Field */}
				<Card.Footer   className="chatBox_footer border-0 p-2 w-100 ">
					{
						messageList.communityData != null &&  
						<CommunityMessageInput communityId={communityId} addNewMessageToChat={addNewMessageToChat}/>
					}
					
				</Card.Footer>
			</Card>

							 
			
    </>
  );
};

export default memo(CommunityChatBoxPage);
