//reducer for feed data list
 
const FeedReducer = { 
    updateFeedState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetFeeds":  
							state.feedList = [...state.feedList, ...action.payload.feedList];
						  break;  
					
					 
							
					case "SetCursor":
							state.cursor= action.payload.cursor; 
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
					 
					case "SetScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
						
					//case for update when user save or unsave feed
					case "updateFeedSaves":
					{
						const {feed_id, feed_type, has_saved} = action.payload.savedData;
						 
						state.feedList = state.feedList.map(feed => {
								if (feed.id == feed_id && feed.type == feed_type) {
										return {
												...feed,
												has_saved: has_saved,
										};
								}
								return feed;
						});
						
						break;
					}	
						//case for delete feed
					case "feedDelete":
					{
						const { delete_feed_id, delete_feed_type } = action.payload.deleteData;

						state.feedList = state.feedList.filter(
								item => !(item.id == delete_feed_id && item.type == delete_feed_type)
						);

						break;
					}	
						
						
						
					// for like or unlike post and like count
					case "updateFeedPostLike":
					{
						 const {post_feed_id, post_feed_type,  post_likes_count, post_like_status  } = action.payload.postLike;
						 
						state.feedList = state.feedList.map(feed => {
								if (feed.id == post_feed_id && feed.type == post_feed_type) {
										return {
												...feed,
												has_liked: post_like_status,
												likes_count: post_likes_count,  
										};
								}
								return feed;
						});
						
						break;
					}
					
					// for   post like count update
					case "updateFeedPostLikeCount":
					{
						 const {post_feed_id, post_feed_type,  post_likes_count    } = action.payload.postLike;
						 
							state.feedList = state.feedList.map(feed => {
								if (feed.id == post_feed_id && feed.type == post_feed_type) {
										return {
												...feed, 
												likes_count: post_likes_count,  
										};
								}
								return feed;
							});
						
							break;
					}						
					
					// for update post comment count
					case "updateFeedPostCommentCount":
					{
						 const {post_comment_feed_id, post_comment_feed_type,  post_comment_count,} = action.payload.commentCountData;
						 
						state.feedList = state.feedList.map(feed => {
								if (feed.id == post_comment_feed_id && feed.type == post_comment_feed_type) {
										return {
												...feed,
												comments_count: post_comment_count,  
										};
								}
								return feed;
						});
						
						break;
					}	
						
					 
					// for update workfolio avg and review count
					case "updateFeedWorkfolioAvgAndReviewCount":
					{
						 const { 
							 feed_id,  
							 feed_type, 
							 workfolio_review_avg_rating,
							 workfolio_review_count,
							 } = action.payload.workfolioAvgANDCount;
						 
						state.feedList = state.feedList.map(feed => {
								if (feed.id == feed_id && feed.type == feed_type) {
										return {
												...feed,
												workfolio_review_avg_rating: workfolio_review_avg_rating, 
												workfolio_review_count: workfolio_review_count , 
										};
								}
								return feed;
						});
						
						break;
					}	
					
					
					
					// for update problem solution count
					case "updateFeedProblemSolutionCount":
					{
						 const { 
							 feed_id,  
							 feed_type, 
							 problem_solution_count,
							 
							 } = action.payload.problemSolutionCountData;
						 
						state.feedList = state.feedList.map(feed => {
								if (feed.id == feed_id && feed.type == feed_type) {
										return {
												...feed,
												solutions_count: problem_solution_count,  
										};
								}
								return feed;
						});
						
						break;
					}	
						
					
					// for update freelance  rating avg and review count
					case "updateFeedFreelanceHirerReviewStats":
					{
						const {avg_rating,   hirer_id, review_count} = action.payload.hirerRivewStats;
						
						state.feedList = state.feedList.map(feed => {
								if (  feed.type == 'freelance' && feed.user && feed.user.id == hirer_id) {
										return {
												...feed,
												user: 
												{
														...feed.user,
														hirer_review_stats: 
														{
															review_count:review_count,
															avg_rating:avg_rating,
														},
												}
										};
								}
								return feed;
						});
							
						
						break;
					}	
						
					
					
					
					
					case "refresh": 
							 state.feedList = []; 
							 
							 state.cursor = null; 
							 
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
					default:
							  
							break;
			}
		},
		 
     
}


export default FeedReducer;