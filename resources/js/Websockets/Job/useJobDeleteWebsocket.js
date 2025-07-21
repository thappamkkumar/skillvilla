import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';  

import {updateJobState as updateAppliedSavedJobState} from '../../StoreWrapper/Slice/AppliedSavedJobSlice';
import {updateJobState as updateUserJobState} from '../../StoreWrapper/Slice/UserJobSlice';
import {updateJobState } from '../../StoreWrapper/Slice/JobSlice';
 import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';



const useJobDeleteWebsocket = (
	logedUserData,
	job_id = null,
	setJobDetail = () => {},
) => {
  const dispatch = useDispatch();
 
 
 // Function to handle problem deletion
  const handleJobDeleted = useCallback((eventData) => {
    const deletedJobData = eventData.deletedJob;
//		console.log(deletedJobData);
		if (logedUserData != null && deletedJobData.user_id == logedUserData.id) {
      return;
    }
		 
		if(deletedJobData.job_id == job_id)
		{ 
			//update local state
			setJobDetail(null);
		}
		dispatch(updateUserJobState({ type: 'deleteJob', job_id:deletedJobData.job_id  }));
		dispatch(updateJobState({ type: 'deleteJob', job_id:deletedJobData.job_id  }));
		dispatch(updateAppliedSavedJobState({ type: 'deleteJob', job_id:deletedJobData.job_id  }));
		dispatch(updateFeedState({type : 'feedDelete', 
									deleteData: {
										'delete_feed_id': deletedJobData.job_id ,
										'delete_feed_type': 'job',
										 
									}							
								}));
								
								
    
  }, [dispatch, logedUserData,   job_id, setJobDetail]);
	
	
	
	
	//websocket connection for job deletion
		const jobDelete_webSocketChannel = `job-delete`; 
		const jobDelete_connectWebSocket = () => {
				window.Echo.channel(jobDelete_webSocketChannel)
						.listen('JobDeleteEvent', async (e) => {
								// e.message   
								 
								handleJobDeleted(e)
								  
						}); 
		};
		useEffect(() => {  
		 
			 jobDelete_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(jobDelete_webSocketChannel);
			};
		}, [ jobDelete_webSocketChannel, job_id]); // Call the effect only once on component mount
		
};

export default useJobDeleteWebsocket;
