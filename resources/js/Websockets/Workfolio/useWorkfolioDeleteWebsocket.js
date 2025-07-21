// it is use in pages/customer/workfolioPage/userWorkfolio & followingUserWorkfolio & workfolioDetail



import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import { updateWorkfolioState } from '../../StoreWrapper/Slice/WorkfolioSlice'; 
import { updateWorkfolioState as updateUserWorkfolioState } from '../../StoreWrapper/Slice/UserWorkfolioSlice'; 
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';


const useWorkfolioDeleteWebsocket  = (
logedUserData, 
workfolio_id=null,
setWorkfolioDetail=()=>{}
 
 ) => {
  
	
	const dispatch = useDispatch();

	// Function to handle workfolio deletion
  const handleWorkfolioDeleted = useCallback((eventData) => {
    const workfolioDeletedData = eventData.workfolioDeletedData;
    if (workfolioDeletedData.user_id == logedUserData.id) {
      return;
    }
    if (workfolio_id != null && workfolioDeletedData.workfolio_id == workfolio_id) {
      setWorkfolioDetail(null); // Update local state to null when workfolio is deleted
    }
    dispatch(updateWorkfolioState({ type: 'deleteWorkfolio', workfolio_id: workfolioDeletedData.workfolio_id }));
    dispatch(updateUserWorkfolioState({ type: 'deleteWorkfolio', workfolio_id: workfolioDeletedData.workfolio_id }));
		dispatch(updateFeedState({type : 'feedDelete', 
								deleteData: {
									'delete_feed_id': workfolioDeletedData.workfolio_id,
									'delete_feed_type': 'workfolio',
									 
								}							
							}));
		
		
  }, [dispatch, logedUserData, workfolio_id, setWorkfolioDetail]);

	 
 
	
	
	//websocket connection for  workfolio  delete
		const workfolioDelete_webSocketChannel = `workfolio-delete`; 
		const workfolioDelete_connectWebSocket = () => {
				window.Echo.channel(workfolioDelete_webSocketChannel)
						.listen('WorkfolioDeleted', async (e) => {
								// e.message   
								 
								handleWorkfolioDeleted(e)
								  
						}); 
		};
		useEffect(() => {  
			 workfolioDelete_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(workfolioDelete_webSocketChannel);
			};
		}, [logedUserData, workfolioDelete_webSocketChannel, workfolio_id]); // Call the effect only once on component mount
		
		
		
};

export default useWorkfolioDeleteWebsocket;
