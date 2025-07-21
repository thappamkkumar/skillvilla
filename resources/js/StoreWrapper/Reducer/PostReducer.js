//reducer for Post List
 
const PostReducer = { 
    updatePostState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetPosts": 
							//state.postList = [...state.postList, ...action.payload.postList];
							state.postList = [...state.postList, ...action.payload.postList];
						  break;  
					
					case "addNewPost": 
					 
							state.postList = [ action.payload.newPost, ...state.postList];
						  break;  
							
					case "SetCursor":
							state.cursor = action.payload.cursor;
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
							
					case "updateCommentCount": 
						let newState = state.postList.map(post => {
							if (post.id === action.payload.commentCount.postId) {
								return {
									...post,
									comments_count: action.payload.commentCount.comments_count  
								};
							}
							return post;
						})
						state.postList = newState;
						break;
						
					case "updatePostLike":
						const updatedPostList = state.postList.map(post => {
								if (post.id === action.payload.newLike.post_id) { 
												return {
														...post, 
														has_liked: action.payload.newLike.status,
														likes_count: action.payload.newLike.likes_count   
												};
										 
								}
								return post; // Return other posts unchanged
						});

						state.postList = updatedPostList;
						break;
					case "updatePostLikeCount":
						const updatePostLikeCount = state.postList.map(post => {
								if (post.id === action.payload.newLike.post_id) { 
												return {
														...post, 
														likes_count: action.payload.newLike.likes_count   
												};
										 
								}
								return post; // Return other posts unchanged
						});

						state.postList = updatePostLikeCount;
						break;

					
					case "updatePostSaves":
						state.postList = state.postList.map(post => {
								if (post.id === action.payload.savedData.post_id) {
										return {
												...post,
												has_saved: action.payload.savedData.status === 'saved'
										};
								}
								return post;
						});
						break;

					case "postDelete":
						const updatedItems = state.postList.map(item => {
							if (item.id === action.payload.postID) 
							{   
								return { id: item.id, deleted: true };    
							}
							return item;
						});
						state.postList = updatedItems;
						break;
						
					case "setScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
					
						case "refresh":
							 state.postList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
					default: 
							break;
			}
		},
		 
     
}


export default PostReducer;