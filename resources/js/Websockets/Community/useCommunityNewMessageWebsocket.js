/*import { useDispatch } from 'react-redux';
import {  useEffect, useCallback, useRef   } from 'react';
 
import { updateCommunityMessageState } from '../../StoreWrapper/Slice/CommunityMessageSlice'; 

const useCommunityNewMessageWebsocket = (communityId, logedUserData, setShowScrollDownBTN)=>
{
  
	const dispatch = useDispatch();
 // Store the latest communityId and logedUserData without causing re-renders
	const communityIdRef = useRef(communityId);
	const logedUserRef = useRef(logedUserData);

	// Update the refs when values change
	useEffect(() => {
			communityIdRef.current = communityId;
	}, [communityId]);

	useEffect(() => {
			logedUserRef.current = logedUserData;
	}, [logedUserData]); 
	 

	const addNewMessage = useCallback((newMessage)=>{
		 
		if (logedUserRef.current && logedUserRef.current.id === newMessage.sender_id) 
		{
            return; // Ignore messages from the logged-in user
    }

		
		  
		if (communityIdRef.current && communityIdRef.current === newMessage.community_id) 
		{ 
			//add new message in community message list 
			dispatch(updateCommunityMessageState(
			{
				type : 'AddNewMessage', 
				newMessage:newMessage
			}));		 
			 
			//it render the scroll to bottom button
			setShowScrollDownBTN(true);
		}	 
		
	}, [ ]);
 		
		
  //websocket connection for add new message for other user or reciever
		const newMessage_webSocketChannel = `community-new-message`; 
		const newMessage_connectWebSocket = () => {
				window.Echo.channel(newMessage_webSocketChannel)
						.listen('CommunityNewMessageEvent', async (e) => {
								// e.message  
								let newMessage = e.newMessage;  
								  //console.log(newMessage);
								 addNewMessage(newMessage);
						}); 
		};
		
		useEffect(() => {  
			 
			 newMessage_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(newMessage_webSocketChannel);
			};
		}, [  ]); // Call the effect only once on component mount

	 
	 
};

export default useCommunityNewMessageWebsocket;
*/



import { useDispatch,useSelector } from 'react-redux';
import {  useEffect, useCallback, useRef   } from 'react';
 
import { updateCommunityMessageState } from '../../StoreWrapper/Slice/CommunityMessageSlice'; 

const useCommunityNewMessageWebsocket = ( )=>
{
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	const communityData = useSelector((state) => state.communityMessageList.communityData); //selecting chat message List from store
	const dispatch = useDispatch();
	
	
 // Store the latest communityId and logedUserData without causing re-renders
	const communityIdRef = useRef(communityData ? communityData.id : null); 
	const logedUserRef = useRef(logedUserData);

	// Update the refs when values change
	useEffect(() => {
			communityIdRef.current = communityData ? communityData.id : null;
	}, [communityData]);

	useEffect(() => {
			logedUserRef.current = logedUserData;
	}, [logedUserData]); 
	 

	const addNewMessage = useCallback((newMessage)=>{
		
		if (logedUserRef.current && logedUserRef.current.id == newMessage.sender_id) 
		{
            return; // Ignore messages from the logged-in user
    }
  
		if (communityIdRef.current && communityIdRef.current == newMessage.community_id) 
		{   
			//add new message in community message list 
			dispatch(updateCommunityMessageState(
			{
				type : 'AddNewMessage', 
				newMessage:newMessage
			}));	  
		}	 
		
	}, [ ]);
 		
		
  //websocket connection for add new message for other user or reciever
		const newMessage_webSocketChannel = `community-new-message`; 
		const newMessage_connectWebSocket = () => {
				window.Echo.channel(newMessage_webSocketChannel)
						.listen('CommunityNewMessageEvent', async (e) => {
								// e.message  
								let newMessage = e.newMessage;  
								 //console.log(newMessage);
								 addNewMessage(newMessage);
						}); 
		};
		
		useEffect(() => {  
			 if(communityData == null)
			 {
				 return;
			 }
			 newMessage_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(newMessage_webSocketChannel);
			};
		}, [communityData]); // Call the effect only once on component mount

	 
	 
};

export default useCommunityNewMessageWebsocket;
