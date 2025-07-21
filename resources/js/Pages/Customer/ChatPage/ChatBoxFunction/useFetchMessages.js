import { useCallback,  useEffect } from 'react'; 
import { updateChatState } from '../../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../../StoreWrapper/Slice/ChatMessageSlice';
import serverConnection from '../../../../CustomHook/serverConnection';

const useFetchMessages = (chatId, scrollRef, loading, setLoading, dispatch, authToken, messageList ) => {
   
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		if(authToken == null || chatId == null)return;
		 
		try
		{ 
			setLoading(true);
			const url = `/get-full-chat?cursor=${ messageList.cursor}`;
			const requestData = {chat_id : chatId, chatUser: messageList.chatUser == null};
			//call the function fetcg post data fron server
			let data = await serverConnection(url, requestData, authToken);
			//  console.log(data);
			if(data.status == true )
			{	  
				if (typeof data.messageList === 'object' && data.messageList !== null &&   Object.keys(data.messageList).length > 0) {
					dispatch(updateChatMessageState({ type: 'SetChatMessage', messageList: data.messageList }));
					//update redux state slected chat latest message read status into true
					dispatch(updateChatState({type : 'UpdateLatestMessageReadStatus', chatId:chatId})); 
				}

				dispatch(updateChatMessageState({type : 'SetCursor', cursor:data.next_cursor})); 
			 	dispatch(updateChatMessageState({type : 'SetHasMore', hasMore:data.next_cursor != null})); 
			 	if(data.chatUser != null)
				{
					dispatch(updateChatMessageState({type : 'SetChatUser', chatUser:data.chatUser})); 
				}	
					  
				 
				 
			}
			 
			setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
		
		
			
	},[   authToken, chatId, messageList.cursor, messageList.scrollHeight, messageList.chatUser, ]); 







	//on first rendering call apiCall function to fetch message
	useEffect(() => { 
		 
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(Object.keys(messageList.messageList).length <= 0)
		{
			apiCall(); 
		}
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, chatId, messageList.messageList]);
 
 
 
 
 
 
 
	//function for call apoCall function or fetch more data on scroll reach top of page 
	 const fetchMoreData = useCallback(() => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
			 
      if (scrollTop == 0 && !loading &&  messageList.hasMore) {
       apiCall();  
			 
      }
    }
  }, [loading, messageList.hasMore]);
	//hook for add scroll event to call function for fetching new data
  useEffect(() => {
    const ref = scrollRef.current;
    if (ref) {
		 	let source2 = axios.CancelToken.source(); 
      ref.addEventListener('scroll', fetchMoreData);
      return () => 
			{  
				ref.removeEventListener('scroll', fetchMoreData);
				// Cancel the request when the component unmounts 
        source2.cancel('Request canceled due to component unmount '); 
			};
    }
  }, [fetchMoreData]);	
	  
		
		
  
};

export default useFetchMessages;
