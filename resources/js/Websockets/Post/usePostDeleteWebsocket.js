import { useEffect } from "react";
import { useDispatch} from "react-redux";

import { updatePostState } from '../../StoreWrapper/Slice/PostSlice';
import { updatePostState as updateUserPostState } from '../../StoreWrapper/Slice/UserPostSlice';
//import { updatePostState as updateMyPostState } from '../../StoreWrapper/Slice/MyPostSlice';
import { updatePostState as updateTaggedSavedPostState } from '../../StoreWrapper/Slice/TaggedSavedPostSlice';
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';


const usePostDeleteWebsocket = (
  loggedUserData,
  postId = null,  
	setPostDetail = ()=>{}, 
) => {
  const dispatch = useDispatch();
	   

	
	
	//websocket connection for deleting post from postList in redux state 
	const postDelete_webSocketChannel = 'post-delete';
	const postDelete_connectWebSocket = () =>
	{
		window.Echo.channel(postDelete_webSocketChannel)
					.listen('PostDeleteEvent', async (e) => {
							// e.message  
							let deleteData = e.postDelete;
							//console.log(deleteData);
							//updating local state
							if(loggedUserData != null && loggedUserData.id == deleteData.user_id)
							{
								return
							}
							if(postId != null && deleteData.post_id == postId)
							{
								setPostDetail(null);
							}
							//update saves array of redux or globle state postState 
							dispatch(updatePostState({type : 'postDelete', postID: deleteData.post_id}));
							
							dispatch(updateUserPostState({type : 'postDelete', postID: deleteData.post_id}));
							
							//dispatch(updateMyPostState({type : 'postDelete', postID: deleteData.post_id}));
						
							dispatch(updateTaggedSavedPostState({type : 'postDelete', postID: deleteData.post_id}));
						  
							dispatch(updateFeedState({type : 'feedDelete', 
								deleteData: {
									'delete_feed_id': deleteData.post_id,
									'delete_feed_type': 'post',
									 
								}							
							}));
							 
					}); 
	};
	useEffect(() => {  
		 postDelete_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(postDelete_webSocketChannel);
		};
	}, [ postDelete_webSocketChannel,setPostDetail, postId,loggedUserData ]); // Call the effect only once on component mount

  
    
   
   
};

export default usePostDeleteWebsocket;
