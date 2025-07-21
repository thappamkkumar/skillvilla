import { useEffect } from "react";
 

const useAddNewProblemSolutionWebsocket = (
  loggedUserData,
  problem_id = null, 
  setProblemSolutionList = () => {}, 
) => {
   
	 
	 //websocket connection for add new solution in list
		const problemNewSolutionAdd_webSocketChannel = `problem-new-solution-add`; 
		const problemNewSolutionAdd_connectWebSocket = () => {
				window.Echo.channel(problemNewSolutionAdd_webSocketChannel)
						.listen('ProblemSolutionAdd', async (e) => {
								// e.message   
								//console.log(e.workfolioNewReview);
								let problemNewSolution =e.problemNewSolutionAdd;
								if(problemNewSolution.user_id == loggedUserData.id)
								{ 
									return;
								}
								if(problem_id != null && problemNewSolution.problem_id == problem_id)
								{ 
									setProblemSolutionList((pre)=>[problemNewSolution, ...pre]);
								} 
								 
								 
						}); 
		};
		useEffect(() => {  
			 problemNewSolutionAdd_connectWebSocket(); //call the function for websocket connection 
			return () => { 
					window.Echo.leave(problemNewSolutionAdd_webSocketChannel);
			};
		}, [loggedUserData, problemNewSolutionAdd_webSocketChannel, problem_id]); // Call the effect only once on component mount
 
   
   
};

export default useAddNewProblemSolutionWebsocket;
