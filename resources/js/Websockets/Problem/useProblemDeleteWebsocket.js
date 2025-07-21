import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProblemState } from '../../StoreWrapper/Slice/ProblemSlice';
import { updateProblemState as updateUserProblemState } from '../../StoreWrapper/Slice/UserProblemSlice'; 
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';


const useProblemDeleteWebsocket = (
  loggedUserData,
   problem_id = null,  
  setProblemDetail = ( )=> {}, 
) => {
  const dispatch = useDispatch();
	
		
 
	 
	//websocket connection for delete problem
		const problemDelete_webSocketChannel = `problem-delete`; 
		const problemDelete_connectWebSocket = () => {
				window.Echo.channel(problemDelete_webSocketChannel)
						.listen('ProblemDelete', async (e) => {
								// e.message   
								// console.log(e);
								let problemDeletedData =e.deletedProblem;
								if(problemDeletedData.user_id == loggedUserData.id)
								{ 
									return;
								} 
								if(problem_id != null && problemDeletedData.problem_id == problem_id)
								{ 
									//update local state
									setProblemDetail(null);
								}
								dispatch(updateProblemState({type : 'deleteProblem', problem_id: problemDeletedData.problem_id}));
								dispatch(updateUserProblemState({type : 'deleteProblem', problem_id: problemDeletedData.problem_id}));
														  
								dispatch(updateFeedState({type : 'feedDelete', 
									deleteData: {
										'delete_feed_id': problemDeletedData.problem_id,
										'delete_feed_type': 'problem',
										 
									}							
								}));
							
							
			 
						}); 
		};
		useEffect(() => {  
			 problemDelete_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(problemDelete_webSocketChannel);
			};
		}, [loggedUserData, problemDelete_webSocketChannel, problem_id]); // Call the effect only once on component mount
 
 
	  
   
   
};

export default useProblemDeleteWebsocket;
