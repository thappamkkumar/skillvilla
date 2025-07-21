import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { updateProblemState } from '../../StoreWrapper/Slice/ProblemSlice';
import { updateProblemState as updateUserProblemState } from '../../StoreWrapper/Slice/UserProblemSlice'; 
import { updateProblemState as updateMyProblemState } from '../../StoreWrapper/Slice/MyProblemSlice'; 
import { updateFeedState } from '../../StoreWrapper/Slice/FeedSlice';




const useProblemSolutionCountWebsocket = (
  loggedUserData,
  problem_id = null,  
  updateProblemSolutionCount = ()=>{}, 
) => {
  const dispatch = useDispatch();
	
	 
 
 
	 
	
	//websocket connection for update problem solution count 
		const problemSolutionCount_webSocketChannel = `problem-solution-count`; 
		const problemSolutionCount_connectWebSocket = () => {
				window.Echo.channel(problemSolutionCount_webSocketChannel)
						.listen('ProblemSolutionCountUpdate', async (e) => {
								// e.message   
								//console.log(e.workfolioAvgAndCount);
								let problemSolutionCount =e.problemSolutionCount;
								if(problemSolutionCount.user_id == loggedUserData.id)
								{ 
									return;
								}
								if(problem_id != null && problemSolutionCount.id == problem_id)
								{ 
									//update local state
									updateProblemSolutionCount(problemSolutionCount)
								}
								
								//update  solution count in  redux state for problem
								dispatch(updateProblemState({type : 'updateSolutionCount', solutionCount: problemSolutionCount}));
								dispatch(updateUserProblemState({type : 'updateSolutionCount', solutionCount: problemSolutionCount}));
								dispatch(updateMyProblemState({type : 'updateSolutionCount', solutionCount: problemSolutionCount}));
								dispatch(updateFeedState({type : 'updateFeedProblemSolutionCount', 
									problemSolutionCountData: {
										'feed_id': problemSolutionCount.id,
										'feed_type': 'problem',
										'problem_solution_count': problemSolutionCount.solutions_count,
										
									}							
								}));
							
							
								  
						}); 
		};
		useEffect(() => {  
			 problemSolutionCount_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(problemSolutionCount_webSocketChannel);
			};
		}, [loggedUserData, problemSolutionCount_webSocketChannel, problem_id]); // Call the effect only once on component mount
 
	 
	  
 
   
   
};

export default useProblemSolutionCountWebsocket;
