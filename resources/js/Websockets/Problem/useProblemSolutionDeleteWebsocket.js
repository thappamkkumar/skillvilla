import { useEffect } from "react";
 
const useProblemSolutionDeleteWebsocket = (
  loggedUserData, 
	problem_id,  
  handleSolutionDelete,
) => {
   
		
	//websocket connection for delete problem
		const problemSolutionDelete_webSocketChannel = `delete-problem-solution`; 
		const problemSolutionDelete_connectWebSocket = () => {
				window.Echo.channel(problemSolutionDelete_webSocketChannel)
						.listen('ProblemSolutionDelete', async (e) => {
								// e.message   
								 // console.log(e);
								let deletedSolutionProblemData =e.deletedSolutionProblem;
								if(deletedSolutionProblemData.user_id == loggedUserData.id)
								{ 
									return;
								} 
								 
									//update local state
								if(deletedSolutionProblemData != null)
								{
									handleSolutionDelete(deletedSolutionProblemData.solution_id);
								}
								 
						}); 
		};
		useEffect(() => {  
		 
			 problemSolutionDelete_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave( problemSolutionDelete_webSocketChannel);
			};
		}, [loggedUserData, problemSolutionDelete_webSocketChannel, problem_id]); // Call the effect only once on component mount
 
  
   
};

export default useProblemSolutionDeleteWebsocket;
