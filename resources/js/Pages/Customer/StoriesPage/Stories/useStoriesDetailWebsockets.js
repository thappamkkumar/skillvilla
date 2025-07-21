import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
 
const useStoriesDetailWebsockets = ( 
	deleteStory,
	addNewStory
 ) => {
  
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
  
	//websocket connection for delete story 
	const storyDelete_webSocketChannel = `delete-story`; 
	const storyDelete_connectWebSocket = () => {
			window.Echo.channel(storyDelete_webSocketChannel)
					.listen('StoryDeleteEvent', async (e) => {
							// e.message   
						 //console.log(e);
							let deletedStoryData =e.deletedStory;
							if(deletedStoryData.user_id == loggedUserData.id)
							{ 
								return;
							} 
						 
							deleteStory(deletedStoryData.user_id, deletedStoryData.story_id);
						 
							
					}); 
	};
	useEffect(() => {  
		storyDelete_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(storyDelete_webSocketChannel);
		};
	}, [storyDelete_webSocketChannel, loggedUserData]); // Call the effect only once on component mount
		
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
								 addNewStory(newStoriesData);
							  
						}); 
		};
		useEffect(() => {  
			addNewStories_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(addNewStories_webSocketChannel);
			};
		}, [addNewStories_webSocketChannel, loggedUserData, addNewStory  ]); // Call the effect only once on component mount
		
	
 
};

export default useStoriesDetailWebsockets;
