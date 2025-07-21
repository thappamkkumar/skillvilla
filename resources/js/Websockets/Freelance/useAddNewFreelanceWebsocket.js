import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateFreelanceState } from '../../StoreWrapper/Slice/UserFreelanceSlice';
 
const useAddNewFreelanceWebsocket = (ID ) =>
{
  const dispatch = useDispatch();





   //function to add new job
  const handleAddNewFreelance = useCallback((eventData) => { 
    let newFreelanceData = eventData.newFreelance;
	 //console.log(newFreelanceData);
		   
		if(newFreelanceData.user_id == ID)
		{  
			dispatch(updateFreelanceState({type : 'addNewFreelance', newFreelance:newFreelanceData})); 
		} 
							  
  }, [dispatch,  ID]);






//websocket connection for add new job  
	const addNewFreelance_webSocketChannel = `add-new-freelance`; 
	const addNewFreelance_connectWebSocket = () => {
			window.Echo.channel(addNewFreelance_webSocketChannel)
					.listen('AddNewFreelanceEvent', async (e) => {
							// e.message   
							 
							handleAddNewFreelance(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {  
		 addNewFreelance_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(addNewFreelance_webSocketChannel);
		};
	}, [ ID]); // Call the effect only once on component mount
  
		
	 
};

export default useAddNewFreelanceWebsocket;
