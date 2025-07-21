

// it is use in pages/customer/workfolioPage/userWorkfolio

import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react';  

import {updateWorkfolioState as updateUserWorkfolioState } from '../../StoreWrapper/Slice/UserWorkfolioSlice';
  
const useAddNewWorkfolioWebsocket  = ( ID) => {
  const dispatch = useDispatch();

	//function to handle  add new workfolio
  const handleAddNewWorkfolio = useCallback((eventData) => { 
    let newWorkfolioData = eventData.newWorkfolio;
		//console.log(newWorkfolioData);
		 
		if(newWorkfolioData.user_id == ID)
		{ 
			dispatch(updateUserWorkfolioState({type : 'addNewWorkfolio', newWorkfolio:newWorkfolioData}));
		} 
  }, [ID]);
	 
//websocket connection for  add new workfolio
		const addNewWorkfolio_webSocketChannel = `add-new-workfolio`; 
		const addNewWorkfolio_connectWebSocket = () => {
				window.Echo.channel(addNewWorkfolio_webSocketChannel)
						.listen('AddNewWorkfolio', async (e) => {
								// e.message   
								 
								handleAddNewWorkfolio(e)
								  
						}); 
		};
		useEffect(() => {  
			 addNewWorkfolio_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(addNewWorkfolio_webSocketChannel);
			};
		}, [ID]); // Call the effect only once on component mount
		 
};

export default useAddNewWorkfolioWebsocket;
