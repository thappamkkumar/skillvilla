import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';
  
import {updateFreelanceState as updateAppliedSavedFreelanceState} from '../../StoreWrapper/Slice/AppliedSavedFreelanceSlice';
import {updateFreelanceState as updateUserFreelanceState} from '../../StoreWrapper/Slice/UserFreelanceSlice';
import {updateFreelanceState } from '../../StoreWrapper/Slice/FreelanceSlice';
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';



const useFreelanceDeleteWebsocket = (
logedUserData,
freelance_id = null,
setFreelanceDetail = () => {},

) => {
  const dispatch = useDispatch();
 
 
 // Function to handle problem deletion
  const handleFreelanceDeleted = useCallback((eventData) => {
    const deletedfreelanceData = eventData.freelanceDelete;
  
		if (logedUserData != null && deletedfreelanceData.user_id == logedUserData.id) {
      return;
    } 
	 
		 
		if(deletedfreelanceData.freelance_id == freelance_id)
		{ 
			//update local state
			setFreelanceDetail(null);
		}
    dispatch(updateUserFreelanceState({ type: 'deleteFreelance', freelance_id:deletedfreelanceData.freelance_id }));
    dispatch(updateFreelanceState({ type: 'deleteFreelance', freelance_id:deletedfreelanceData.freelance_id }));
    dispatch(updateAppliedSavedFreelanceState({ type: 'deleteFreelance', freelance_id:deletedfreelanceData.freelance_id }));
		dispatch(updateFeedState({type : 'feedDelete', 
									deleteData: {
										'delete_feed_id': deletedfreelanceData.freelance_id,
										'delete_feed_type': 'freelance',
										 
									}							
								}));
		
     
  }, [dispatch, logedUserData, setFreelanceDetail, freelance_id]);
	
	
	
	
	//websocket connection for job deletion
		const freelanceDelete_webSocketChannel = `freelance-delete`; 
		const freelanceDelete_connectWebSocket = () => {
				window.Echo.channel(freelanceDelete_webSocketChannel)
						.listen('FreelanceDeleteEvent', async (e) => {
								// e.message   
								 
								handleFreelanceDeleted(e)
								  
						}); 
		};
		useEffect(() => {  
			 freelanceDelete_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(freelanceDelete_webSocketChannel);
			};
		}, [ freelanceDelete_webSocketChannel, freelance_id]); // Call the effect only once on component mount
		
};

export default useFreelanceDeleteWebsocket;
