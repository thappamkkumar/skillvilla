import { useDispatch } from 'react-redux';
import {  useEffect } from 'react'; 
import { updatePostState as updateUserPostState} from '../../StoreWrapper/Slice/UserPostSlice'; 

const useAddNewPostWebsocket  = ( ID) => {
  const dispatch = useDispatch();

 		
 
  //websocket connection for add new post
		const addNewPost_webSocketChannel = `add-new-post`; 
		const addNewPost_connectWebSocket = () => {
				window.Echo.channel(addNewPost_webSocketChannel)
						.listen('AddNewPost', async (e) => {
								// e.message   
							   
								let newPostData =e.newPost;
								 
								if(newPostData.user_id == ID)
								{ 
									dispatch(updateUserPostState({type : 'addNewPost', newPost:newPostData}));
								} 
								else{
									return;
								}
							  
						}); 
		};
		useEffect(() => {  
		 
			addNewPost_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(addNewPost_webSocketChannel);
			};
		}, [ID, ]); // Call the effect only once on component mount
		
		
 
 
 
		
	 
};

export default useAddNewPostWebsocket;
