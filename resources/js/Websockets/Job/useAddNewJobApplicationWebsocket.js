import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';  
import {updateJobApplicationState} from '../../StoreWrapper/Slice/JobApplicationSlice';
 
 
const useAddNewJobApplicationWebsocket = (job_id) =>
{
  const dispatch = useDispatch();

   //function to add new job
  const handleAddNewJobApplication = useCallback((eventData) => { 
    let newJobApplicationData = eventData.newJobApplication;
	  //console.log(newJobApplicationData);
		   
		  if(job_id == newJobApplicationData.company_job_id)
			{
				dispatch(updateJobApplicationState({type : 'addNewJobApplication', newJobApplication:newJobApplicationData}));
				dispatch(updateJobApplicationState({type : 'updateJobApplicationCount'}));
			}
							  
  }, [dispatch, job_id  ]);

//websocket connection for add new job application  
	const addNewJobApplication_webSocketChannel = `add-new-job-application`; 
	const addNewJobApplication_connectWebSocket = () => {
			window.Echo.channel(addNewJobApplication_webSocketChannel)
					.listen('AddNewJobApplicationEvent', async (e) => {
							// e.message   
							 
							handleAddNewJobApplication(e)
								
					}); 
	};
	useEffect(() => {  
		 addNewJobApplication_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(addNewJobApplication_webSocketChannel);
		};
	}, [  addNewJobApplication_webSocketChannel, job_id]); // Call the effect only once on component mount
  
		
	 
};

export default useAddNewJobApplicationWebsocket;
