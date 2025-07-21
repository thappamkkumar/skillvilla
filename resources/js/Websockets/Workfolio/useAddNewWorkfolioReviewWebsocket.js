// it is use in Components\Customer\Workfolio\WorkfolioReviews.jsx
 
 
import { useCallback, useEffect } from 'react'; 
 
const useAddNewWorkfolioReviewWebsocket  = (
logedUserData, 
workfolio_id=null,
setWorkfolioReviewList=()=>{}
 
 ) => {
  
	 
	// Function to handle workfolio deletion
  const handleAddNewWorkfolioReview = useCallback((eventData) => {
    //console.log(e.workfolioNewReview);
			let newReview =eventData.workfolioNewReview;
			if(newReview.user_id == logedUserData.id)
			{ 
				return;
			}
			if(newReview.workfolio_id == workfolio_id)
			{ 
				setWorkfolioReviewList((pre)=>[newReview, ...pre]);
			} 
								 
  }, [   logedUserData, workfolio_id, setWorkfolioReviewList]);

	 
 
	
	
	//websocket connection for add new review in list
		const workfolioReviewAdd_webSocketChannel = `workfolio-review-add`; 
		const workfolioReviewAdd_connectWebSocket = () => {
				window.Echo.channel(workfolioReviewAdd_webSocketChannel)
						.listen('WorkfolioReviewAdd', async (e) => {
								// e.message   
								handleAddNewWorkfolioReview(e);
								 
						}); 
		};
		useEffect(() => {  
			 workfolioReviewAdd_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(workfolioReviewAdd_webSocketChannel);
			};
		}, [logedUserData, workfolioReviewAdd_webSocketChannel, workfolio_id]); // Call the effect only once on component mount
 
		
		
};

export default useAddNewWorkfolioReviewWebsocket;
