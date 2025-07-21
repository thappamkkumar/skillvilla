import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
 
const useStoryDetailWebsockets = (
	storyId, 
	storyUserId,
	updateStoryLikeCount,
	updateStoryCommentCount,
	addNewComment,
 ) => {
  
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
  
	
	//websocket connection for story like
		const likeStory_webSocketChannel = `story-like`; 
		const likeStory_connectWebSocket = () => {
				window.Echo.channel(likeStory_webSocketChannel)
						.listen('StoryLikeEvent', async (e) => {
								// e.message   
							// console.log(e);
								let likedStoryData =e.likedStory;
								if(likedStoryData.user_id == loggedUserData.id)
								{ 
									return;
								} 
								if(likedStoryData.story_id == storyId)
								{ 
									updateStoryLikeCount(likedStoryData.likes_count);
								} 
							  
						}); 
		};
		useEffect(() => {  
			likeStory_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(likeStory_webSocketChannel);
			};
		}, [likeStory_webSocketChannel, loggedUserData.id, storyId, updateStoryLikeCount]); // Call the effect only once on component mount
		
		
	//websocket connection for story new comments
	const storyNewComment_webSocketChannel = `story-new-comment`; 
	const storyNewComment_connectWebSocket = () => {
			window.Echo.channel(storyNewComment_webSocketChannel)
					.listen('StoryCommentEvent', async (e) => {
							// e.message   
						 //console.log(e);
							let storyNewCommentData =e.storyNewComment;
							if(storyNewCommentData.newComment.user_id == loggedUserData.id)
							{ 
								return;
							} 
						 
							if( storyNewCommentData.newComment.stories_id == storyId  )
							{  
								updateStoryCommentCount(storyNewCommentData.comments_count);
								if(storyUserId == loggedUserData.id)
								{
									addNewComment(storyNewCommentData.newComment);
								}
							} 
							
					}); 
	};
	useEffect(() => {  
		storyNewComment_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(storyNewComment_webSocketChannel);
		};
	}, [storyNewComment_webSocketChannel, loggedUserData.id,storyId,storyUserId, addNewComment, updateStoryCommentCount,]); // Call the effect only once on component mount
		
 
};

export default useStoryDetailWebsockets;
