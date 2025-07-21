import { useDispatch } from 'react-redux';
import { useCallback, useEffect } from 'react'; 
import {updateFreelanceState} from '../../StoreWrapper/Slice/MyFreelanceSlice';
 
const useFreelanceBidCountWebsocket = (
	logedUserData,
	freelance_id = null,
	setFreelanceDetail = () => {},
	
 ) =>
{
  const dispatch = useDispatch();

 

   //function to add new job
  const handleFreelanceBidCount = useCallback((eventData) => { 
    let freelanceBidCountData = eventData.freelanceBidCount;
		//console.log(freelanceBidCountData);

		if(logedUserData != null && logedUserData.id == freelanceBidCountData.freelance_user_id)
		{  	 
			if(freelance_id != null && freelance_id == freelanceBidCountData.freelance_id)
			{
				setFreelanceDetail((pre)=>({...pre, bids_count:freelanceBidCountData.bids_count}));
			}
			dispatch(updateFreelanceState({ type: 'increamentFreelanceBidCount', freelanceCount:freelanceBidCountData}));
		}
		else
		{
			return;
		}

			
		 
							  
  }, [dispatch, logedUserData,  freelance_id, setFreelanceDetail]);






//websocket connection for add new job  
	const freelanceBidCount_webSocketChannel = `freelance-bid-count`; 
	const freelanceBidCount_connectWebSocket = () => {
			window.Echo.channel(freelanceBidCount_webSocketChannel)
					.listen('FreelanceBidCountEvent', async (e) => {
							// e.message   
							 
							handleFreelanceBidCount(e)
								
					}); 
	};
	
	
	
	
	useEffect(() => {   
		 freelanceBidCount_connectWebSocket(); //call the function for websocket connection 
		return () => { 
				window.Echo.leave(freelanceBidCount_webSocketChannel);
		};
	}, [  freelanceBidCount_webSocketChannel, freelance_id]); // Call the effect only once on component mount
  
		
	 
};

export default useFreelanceBidCountWebsocket;
