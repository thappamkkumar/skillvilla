// it is use in pages/customer/problemPage/userProblem
 
 
 import { useDispatch } from 'react-redux';
import { useCallback, useEffect} from 'react';   

import {updateProblemState as updateUserProblemState} from '../../StoreWrapper/Slice/UserProblemSlice';
  
 
const useAddNewProblemWebsocket  = (ID ) => {
  
	 const dispatch = useDispatch();
 
	
	
	//function to add new problem
  const handleAddNewProblem = useCallback((eventData) => { 
    let newProblemData = eventData.newProblem;
		//console.log(newWorkfolioData); 
		 
		if(newProblemData.user_id == ID)
		{ 
			dispatch(updateUserProblemState({type : 'addNewProblem', newProblem:newProblemData}));
		} 
							  
  }, [ ID]);
	 
	 
	 
	 
//websocket connection for add new problem  
	const addNewProblem_webSocketChannel = `add-new-problem`; 
	const addNewProblem_connectWebSocket = () => {
			window.Echo.channel(addNewProblem_webSocketChannel)
					.listen('AddNewProblem', async (e) => {
							// e.message   
							 
							handleAddNewProblem(e)
								
					}); 
	};
	useEffect(() => {  
		 addNewProblem_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(addNewProblem_webSocketChannel);
		};
	}, [ ID]); // Call the effect only once on component mount
   
 
		
		
};

export default useAddNewProblemWebsocket;
