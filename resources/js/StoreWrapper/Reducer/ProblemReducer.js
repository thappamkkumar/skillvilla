//reducer for problem List  
 
const ProblemReducer = { 
    updateProblemState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetProblem": 
					 
							state.problemList = [...state.problemList, ...action.payload.problemList];
						  break;  
				
				case "addNewProblem": 
					 
							state.problemList = [ action.payload.newProblem, ...state.problemList];
						  break;  
					 
					case "SetCursor":
							state.cursor = action.payload.cursor;
							break;
							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
							  
					case "setScrollHeightPosition":
						state.scrollHeightPosition = action.payload.scrollHeightPosition;
						break;
						
					case "updateSolutionCount":
						const { id, solutions_count } = action.payload.solutionCount;
						state.problemList = state.problemList.map((problem) =>
								problem.id === id
										? { 
												...problem, 
												solutions_count
											}
										: problem
						);
						break;
						
					case "updateProblemSaves": 
						state.problemList = state.problemList.map(item => {
								if (item.id === action.payload.savedData.problem_id) {
										return {
												...item,
												has_saved: !!action.payload.savedData.status
										};
								}
								return item;
						});
						break;
					
					 
					case "deleteProblem":
						const updatedItems = state.problemList.map(item => {
							if (item.id === action.payload.problem_id) 
							{   
								return { id: item.id, deleted: true };    
							}
							return item;
						});
						state.problemList = updatedItems;
						break;
						
					default:
							 state.problemList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
			}
		},
		 
     
}


export default ProblemReducer;