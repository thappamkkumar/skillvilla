import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateFreelanceBidState} from '../../StoreWrapper/Slice/FreelanceBidSlice';
 
const useAddNewFreelanceBidWebsocket = (freelance_id ) =>
{
  const dispatch = useDispatch();





   //function to add new job
  const handleAddNewFreelanceBid = useCallback((eventData) => { 
    let newFreelanceBidData = eventData.newFreelanceBid;
	 //console.log(newFreelanceBidData);
		 
		if(freelance_id == newFreelanceBidData.freelance_id)
		{
			dispatch(updateFreelanceBidState({type : 'addNewFreelanceBid', newFreelanceBid:newFreelanceBidData}));
			dispatch(updateFreelanceBidState({type : 'updateFreelanceBidCount'}));
		}
		 
							  
  }, [dispatch,  freelance_id]);






//websocket connection for add new job  
	const addNewFreelanceBid_webSocketChannel = `add-new-freelance-bid`; 
	const addNewFreelanceBid_connectWebSocket = () => {
			window.Echo.channel(addNewFreelanceBid_webSocketChannel)
					.listen('AddNewFreelanceBidEvent', async (e) => {
							// e.message   
							 
							handleAddNewFreelanceBid(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 addNewFreelanceBid_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(addNewFreelanceBid_webSocketChannel);
		};
	}, [  addNewFreelanceBid_webSocketChannel, freelance_id]); // Call the effect only once on component mount
  
		
	 
};

export default useAddNewFreelanceBidWebsocket;
