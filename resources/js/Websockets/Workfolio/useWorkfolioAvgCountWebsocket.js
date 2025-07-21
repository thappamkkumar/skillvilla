
// it is use in pages/customer/workfolioPage/userWorkfolio & followingUserWorkfolio & workfolio & workfolioDetail


import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import { updateWorkfolioState } from '../../StoreWrapper/Slice/WorkfolioSlice'; 
import { updateWorkfolioState as updateUserWorkfolioState } from '../../StoreWrapper/Slice/UserWorkfolioSlice';
import {updateWorkfolioState as updateMyWorkfolioState} from '../../StoreWrapper/Slice/MyWorkfolioSlice'; 
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';



const useWorkfolioAvgCountWebsocket  = (
logedUserData, 
workfolio_id=null,
setWorkfolioDetail=()=>{}
 
 ) => {
  
	
	const dispatch = useDispatch();

	 // Function to handle average and count update
  const handleAvgAndCountUpdate = useCallback((eventData) => {
    const avgAndCount = eventData.workfolioAvgAndCount;
		
    if (avgAndCount.user_id == logedUserData.id) {
      return;
    }  
    if (workfolio_id != null && avgAndCount.id == workfolio_id) {
      // Update local state for the workfolio's rating avg and count
      setWorkfolioDetail((prevState) => ({
        ...prevState,
        workfolio_review_avg_rating: avgAndCount.workfolio_review_avg_rating,
        workfolio_review_count: avgAndCount.workfolio_review_count,
      }));
    }

    dispatch(updateWorkfolioState({ type: 'updateAvgAndCount', workfolioAvgANDCount: avgAndCount }));
    dispatch(updateUserWorkfolioState({ type: 'updateAvgAndCount', workfolioAvgANDCount: avgAndCount }));
    dispatch(updateMyWorkfolioState({ type: 'updateAvgAndCount', workfolioAvgANDCount: avgAndCount }));
		dispatch(updateFeedState({type : 'updateFeedWorkfolioAvgAndReviewCount', 
								workfolioAvgANDCount: {
									'feed_id': avgAndCount.id,
									'feed_type': 'workfolio',
									'workfolio_review_avg_rating': avgAndCount.workfolio_review_avg_rating,
									'workfolio_review_count': avgAndCount.workfolio_review_count,
									
								}							
							}));
							 
		
		
		
  }, [dispatch, logedUserData, workfolio_id, setWorkfolioDetail]);

	 
 
	
	//websocket connection for  workfolio average count update
		const workfolioAvgCountUpdate_webSocketChannel = `workfolio-average-count-update`; 
		const workfolioAvgCountUpdate_connectWebSocket = () => {
				window.Echo.channel(workfolioAvgCountUpdate_webSocketChannel)
						.listen('WorkfolioAvgAndCountUpdate', async (e) => {
								// e.message   
								handleAvgAndCountUpdate(e)
								  
						}); 
		};
		useEffect(() => {  
			 workfolioAvgCountUpdate_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(workfolioAvgCountUpdate_webSocketChannel);
			};
		}, [logedUserData, workfolioAvgCountUpdate_webSocketChannel, workfolio_id]); // Call the effect only once on component mount
		
		
		
};

export default useWorkfolioAvgCountWebsocket;
