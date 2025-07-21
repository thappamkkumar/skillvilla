import { useDispatch, useSelector } from 'react-redux';   
import { useCallback, useEffect } from 'react'; 
import {updateStoriesState as updateUserStoriesState} from '../../../../StoreWrapper/Slice/UserStoriesSlice';


const useStoriesWebsockets = ( ) => {
  const dispatch = useDispatch();
	 const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info
	
		//websocket connection for add new story
		const addNewStories_webSocketChannel = `add-new-stories`; 
		const addNewStories_connectWebSocket = () => {
				window.Echo.channel(addNewStories_webSocketChannel)
						.listen('AddNewStories', async (e) => {
								// e.message   
							   //console.log(e);
								let newStoriesData =e.newStories;
								if(newStoriesData.user_id == loggedUserData.id)
								{ 
									return;
								} 
								dispatch(updateUserStoriesState({type : 'addFollowingUserNewStories', newStory:newStoriesData})); 
						}); 
		};
		useEffect(() => {  
			addNewStories_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(addNewStories_webSocketChannel);
			};
		}, [addNewStories_webSocketChannel, loggedUserData  ]); // Call the effect only once on component mount
		
		//websocket connection for delete story 
	const storyDelete_webSocketChannel = `delete-story`; 
	const storyDelete_connectWebSocket = () => {
			window.Echo.channel(storyDelete_webSocketChannel)
					.listen('StoryDeleteEvent', async (e) => {
							// e.message   
						 // console.log(e);
							let deletedStoryData =e.deletedStory;
							if(deletedStoryData.user_id == loggedUserData.id)
							{ 
								return;
							} 
							if(deletedStoryData.storyCount == 0)
							{
									dispatch(updateUserStoriesState({type : 'removeFollowingUserStories', userId:deletedStoryData.user_id})); 
							}
							else if(deletedStoryData.latestStory != null)
							{
									dispatch(updateUserStoriesState({type : 'addFollowingUserNewStories', newStory:deletedStoryData.latestStory})); 
							}
							else{}
							 
					}); 
	};
	useEffect(() => {  
		storyDelete_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(storyDelete_webSocketChannel);
		};
	}, [storyDelete_webSocketChannel, loggedUserData]); // Call the effect only once on component mount
		
	 
};

export default useStoriesWebsockets;
