//reducer for Comment List on post
 
const CommentReducer = { 
    updateCommentState(state, action)
    {  
		
			
			switch (action.payload.type)
			{
					case "SetCommentStatus":
							state.commentStatus = action.payload.commentStatus;
							break;
							
					case "SetPostID":
							state.postID = action.payload.postID;
							break;
					 
					case "SetComments":
						state.commentList = [...state.commentList, ...action.payload.commentList];
						break;
					
					case "SetNewComment":
						state.commentList = [action.payload.newComment, ...state.commentList]
						break;
						
					case "SetCursor":
							state.cursor = action.payload.cursor;
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
					default:
							  
							 state.commentStatus = false;
							 state.postID = null;
							 state.commentList = [];
							 state.cursor = null; 
							 state.hasMore = false;
							break;
			}
			
			
			 
		},
		 
}


export default CommentReducer;