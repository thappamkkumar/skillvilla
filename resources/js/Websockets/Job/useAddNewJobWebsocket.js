import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateJobState} from '../../StoreWrapper/Slice/UserJobSlice';
 
const useAddNewJobWebsocket  = (ID ) =>
{
  const dispatch = useDispatch();

   //function to add new job
  const handleAddNewJob = useCallback((eventData) => { 
    let newJobData = eventData.newJob;
	 //console.log(newJobData);
		   
		if(newJobData.user_id == ID)
		{  
			dispatch(updateJobState({type : 'addNewJob', newJob:newJobData}));
		} 
							  
  }, [dispatch,  ID]);

//websocket connection for add new job  
	const addNewJob_webSocketChannel = `add-new-job`; 
	const addNewJob_connectWebSocket = () => {
			window.Echo.channel(addNewJob_webSocketChannel)
					.listen('AddNewJobEvent', async (e) => {
							// e.message   
							 
							handleAddNewJob(e)
								
					})
					.error((error) => {
							console.error("WebSocket connection error:", error);
						}); 
	};
	useEffect(() => {  
		 addNewJob_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(addNewJob_webSocketChannel);
		};
	}, [ID]); // Call the effect only once on component mount
  
		
	 
};

export default useAddNewJobWebsocket;
