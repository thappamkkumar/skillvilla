//reducer for stories List  
 
const StoriesReducer = { 
    updateStoriesState(state, action)
    {  
			switch (action.payload.type)
			{
					 //this will set stories of following users
					case "SetFollowingUserStories":  
							state.storiesList = [...state.storiesList, ...action.payload.storiesList];
						  break;  
					//this will set story of logged user
					case "SetLoggedUserStories":  
							state.storiesList = [ action.payload.storiesList, ...state.storiesList];
						  break;  
					 
					case "SetCursor":
							state.cursor = action.payload.cursor;
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
							  
					case "setScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
						
					case "SetLoggedUserCanAddStory": 
						state.canAddStory = action.payload.canAddStory;
						break;
					
					//it use to when new story add and also when story delete and delete story is latest story so get previous story and update in state
					case "addLoggedUserNewStories":
					 	const preStory = state.storiesList;
						const newStory = action.payload.newStory;
						if(preStory != null && preStory.length > 0)
						{
							preStory[0].id = newStory.id;
							preStory[0].story_file = newStory.story_file;
							preStory[0].created_at_human_readable = newStory.created_at_human_readable;
						}
						 
						state.storiesList = preStory;
					break;
					
					 
					
					case "addFollowingUserNewStories":
						const followingUserNewStory = action.payload.newStory;
						 
						const updatedItems = state.storiesList.map((user) => {
							if (user.id == followingUserNewStory.user_id) {
								return {
									...user,
									stories: user.stories.map((story, index) =>
										index == 0
											? {
													...story,
													id: followingUserNewStory.id,
													story_file: followingUserNewStory.story_file,
													created_at_human_readable: followingUserNewStory.created_at_human_readable,
												}
											: story
									),
								};
							}
							return user; // Return unchanged users
						});

						state.storiesList = updatedItems; // Update state
						break;
						
					case "removeFollowingUserStories":
						const userId = action.payload.userId;
						state.storiesList = state.storiesList.filter(user => user.id !== userId);
						break;
						
					case "refresh":
						 state.storiesList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
						break;
						
					 
					default:
							 
							break;
			}
		},
		 
     
}


export default StoriesReducer;