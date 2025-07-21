import { useEffect } from "react";
import { useDispatch} from "react-redux";

import { updatePostState } from '../../StoreWrapper/Slice/PostSlice';
import { updatePostState as updateUserPostState } from '../../StoreWrapper/Slice/UserPostSlice';
import { updatePostState as updateMyPostState } from '../../StoreWrapper/Slice/MyPostSlice';
import { updatePostState as updateTaggedSavedPostState } from '../../StoreWrapper/Slice/TaggedSavedPostSlice';
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';


const usePostLikeWebsocket = (
  loggedUserData,
  postId = null,  
	updatePostDetailLikeCount = ()=>{}, 
) => {
  const dispatch = useDispatch();
	   
	//websocket connection for update like array in redux state and also in state of post detail
 const postLike_webSocketChannel = 'post-like';
 const postLike_connectWebSocket = () =>
 {
		window.Echo.channel(postLike_webSocketChannel)
					.listen('PostLikeEvent', async (e) => {
							// e.message  
							let newLike = e.postLike;
							 //console.log(newLike);
							 if(loggedUserData != null && loggedUserData.id == newLike.user_id)
							{
								return
							}   
							 // Update local state of postDetail
							if (postId != null && newLike.post_id == postId) {
									updatePostDetailLikeCount(newLike);
							}
						 
							//update like array of redux or globle state postState
						dispatch(updatePostState({type : 'updatePostLikeCount', newLike: newLike}));
						
						dispatch(updateUserPostState({type : 'updatePostLikeCount', newLike: newLike}));
						
						dispatch(updateMyPostState({type : 'updatePostLikeCount', newLike: newLike}));
						
						dispatch(updateTaggedSavedPostState({type : 'updatePostLikeCount', newLike: newLike}));

						dispatch(updateFeedState({type : 'updateFeedPostLikeCount', postLike: {
									'post_likes_count': newLike.likes_count, 
									'post_feed_id':newLike.post_id,
									'post_feed_type':'post',
							} }));  
					
							 
					}); 
 };
 useEffect(() => {  
		 
      postLike_connectWebSocket(); // Initialize WebSocket connection
    
		return () => { 
				window.Echo.leave(postLike_webSocketChannel);
    };
	}, [ postId, loggedUserData , postLike_webSocketChannel ]); // Call the effect only once on component mount



  
  
    
   
   
};

export default usePostLikeWebsocket;
