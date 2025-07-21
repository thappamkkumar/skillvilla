import {memo, useState, useEffect,useCallback, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';  
import _ from 'lodash';  
import ListGroup from 'react-bootstrap/ListGroup';
import Spinner from 'react-bootstrap/Spinner'; 

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer';  
import Chat from '../Chat/Chat'
import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';

import serverConnection from '../../../CustomHook/serverConnection'; 
import useIsSmallScreen from '../../../CustomHook/useIsSmallScreen'; 
import useSendNewMessageWebsocket from '../../../Websockets/Chat/useSendNewMessageWebsocket'; 
import useChatDeleteWebsocket from '../../../Websockets/Chat/useChatDeleteWebsocket'; 
 
const ChatList = ({chatId}) => {
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
  const chatList = useSelector((state) => state.chatList); //selecting chat List from store
	const [loading, setLoading] = useState(false); 
  const scrollRef = useRef(null);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const isSmallScreen =  useIsSmallScreen();//custom hook for check the screen width	
	 
	  
	// Call the  hook for websockets event listeners
	useSendNewMessageWebsocket(  
	logedUserData, 
	chatList,
	authToken, 
	chatId == null ? true : isSmallScreen,
	null,
	()=>{});
	
	useChatDeleteWebsocket(  
	logedUserData,  
	chatId == null ? true : isSmallScreen,
	null);
	 
	
	 
	 //function for fetching data
	const apiCall = useCallback(async()=>{ 
		if(authToken == null)return;
		try
		{ 
			setLoading(true);
			//call the function fetcg post data fron server
			let data = await serverConnection(`/get-chat-list?cursor=${chatList.cursor}`, { }, authToken);
			//update the post state in redux.
			//console.log(data);
			 if(data.status == true && data.chatList.data.length != 0 )
			 {  
					dispatch(updateChatState({type : 'SetChat', chatList: data.chatList.data}));  
					dispatch(updateChatState({type : 'SetCursor', cursor: data.chatList.next_cursor})); 
					dispatch(updateChatState({type : 'SetHasMore', hasMore: data.chatList.next_cursor != null})); 
				
				
			 }
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[dispatch, authToken, chatList.cursor]); 





	useEffect(() => {  
		  
		// Create a cancel token source
		let source = axios.CancelToken.source();
		if(chatList.chatList.length == 0)
		{
			apiCall(); 
		}
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, chatList.chatList.length]);
	
	
	 
	 
	 
	
		//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateChatState({type : 'SetScrollHeightPosition', scrollHeightPosition: scrollTop})); 
  }, [dispatch]);
	
 
	
	
	
	
  return (
     
    <InfiniteScrollContainer
      fetchData={apiCall}
      hasMore={chatList.hasMore}
			loading={loading}
      initialScrollPosition={chatList.scrollHeightPosition}
			onScrollUpdate={handleScrollUpdate}
			style = "  px-0 pt-0 pb-5  main_container " 
    >
			
			<h4 className="px-3   "> <span className="border-bottom border-3  px-1">Chats</span></h4>
		 
			
			 {
			  		chatList.chatList.length <= 0 && !loading &&
						(
							<h6 className="py-4  text-center text-muted">
									No conversations yet. Start a chat to connect with others!
								</h6>
						)
						
						
				}
				{
						chatList.chatList.length > 0  &&(
						
							<ListGroup  className="p-0 pb-2 customListGroupContainer  rounded-0 overflow-hidden"  >
						
								{chatList.chatList.map((chat) => (
								
									<Chat key={chat.id} chat={chat} chatId={chatId}   />
									
								))}
							</ListGroup>
							 
						)
						
				}
			 
		
    	</InfiniteScrollContainer>
  );
};

export default  memo(ChatList);
