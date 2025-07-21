import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import { updateJobState } from '../../StoreWrapper/Slice/MyJobSlice'; 
 
const useJobApplicationCountWebsocket  = (
	logedUserData,
	job_id = null,
	setJobDetail = () => {},
) => {
  const dispatch = useDispatch();
 
 
 // Function to handle  job application count update
  const handleJobApplicationCount = useCallback((eventData) => {
    const jobApplicationCountData = eventData.jobApplicationCount;
    if(logedUserData != null && logedUserData.id == jobApplicationCountData.job_user_id)
		{  
			if(job_id != null && job_id == jobApplicationCountData.job_id)
			{
				setJobDetail((pre)=>({...pre, applications_count:jobApplicationCountData.applications_count}));
			}
			dispatch(updateJobState({ type: 'increamentJobApplicationCount', jobCount:jobApplicationCountData}));
		}
		else
		{
			return;
		}
    
  }, [dispatch,logedUserData, job_id, setJobDetail ]);
	
	
	
	
	//websocket connection for job application count update
		const jobApplicationCount_webSocketChannel = `job-application-count`; 
		const jobApplicationCount_connectWebSocket = () => {
				window.Echo.channel(jobApplicationCount_webSocketChannel)
						.listen('JobApplicationCountEvent', async (e) => {
								// e.message   
								 
								handleJobApplicationCount(e)
								//  console.log(e);
						}); 
		};
		useEffect(() => {  
		 
			 jobApplicationCount_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(jobApplicationCount_webSocketChannel);
			};
		}, [ jobApplicationCount_webSocketChannel,  job_id]); // Call the effect only once on component mount
		
};

export default useJobApplicationCountWebsocket;
