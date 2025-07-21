import { useEffect } from "react";
import { useDispatch} from "react-redux";

import { updatePostState } from '../../StoreWrapper/Slice/PostSlice';
import { updatePostState as updateUserPostState } from '../../StoreWrapper/Slice/UserPostSlice';
import { updatePostState as updateMyPostState } from '../../StoreWrapper/Slice/MyPostSlice';
import { updatePostState as updateTaggedSavedPostState } from '../../StoreWrapper/Slice/TaggedSavedPostSlice';
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';


const usePostCommentCountWebsocket  = (
  loggedUserData,
  postId = null,  
	updatePostDetailCommentCount = ()=>{}, 
) => {
  const dispatch = useDispatch();
	   
	//websocket connection for update comment list or new comment add in list
	const postCommentCount_webSocketChannel = `post-comments-count`; 
	const postCommentCount_connectWebSocket = () => {
			window.Echo.channel(postCommentCount_webSocketChannel)
					.listen('PostCommentCountEvent', async (e) => {
							// e.message  
							let postCommentCount = e.postCommentCount; 
														
							if(loggedUserData != null && loggedUserData.id == postCommentCount.user_id)
							{
								return
							}
							// console.log(postCommentCount);	
							if(postId != null && postCommentCount.postId == postId)
							{
								updatePostDetailCommentCount(postCommentCount)
							}
							dispatch(updatePostState({type : 'updateCommentCount', commentCount: postCommentCount}));
							
							dispatch(updateUserPostState({type : 'updateCommentCount', commentCount: postCommentCount}));
							
							dispatch(updateMyPostState({type : 'updateCommentCount', commentCount: postCommentCount}));
							
							dispatch(updateTaggedSavedPostState({type : 'updateCommentCount', commentCount: postCommentCount}));
							dispatch(updateFeedState({type : 'updateFeedPostCommentCount', 
								commentCountData: {
									'post_comment_feed_id': postCommentCount.postId,
									'post_comment_feed_type': 'post',
									'post_comment_count': postCommentCount.comments_count,
									
								}							
							}));
							 
							 
					}); 
	};
	useEffect(() => {  
		 postCommentCount_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(postCommentCount_webSocketChannel);
    };
	}, [postId, postCommentCount_webSocketChannel, loggedUserData]); // Call the effect only once on component mount

  
    
   
   
};

export default usePostCommentCountWebsocket;
