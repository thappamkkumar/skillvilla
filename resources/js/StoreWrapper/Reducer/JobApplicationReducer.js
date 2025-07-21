//reducer for problem List  
 
const JobApplicationReducer = { 
    updateJobApplicationState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetJobApplication": 
						state.jobApplicationList = [...state.jobApplicationList, ...action.payload.jobApplicationList];
						  break;  
				
				case "SetJobData": 
					 
							state.jobData = action.payload.jobData;
						  break;  
				
				case "addNewJobApplication": 
					 
							state.jobApplicationList = [ action.payload.newJobApplication, ...state.jobApplicationList];
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
						
					case 'updateJobApplicationCount':
						state.jobData = {
								...state.jobData,
								totalApplications: state.jobData.totalApplications + 1
						};
						break;

					case 'updateJobApplicationStatus':
						state.jobApplicationList = state.jobApplicationList.map(jobApplication => {
								if (jobApplication.id == action.payload.newStatus.id) {
										return {
												...jobApplication,
												status: action.payload.newStatus.status 
										};
								}
								return jobApplication;
						});
						break; 
						
					default:
							 state.jobApplicationList = []; 
							 state.jobData = {}; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
			}
		},
		 
     
}


export default JobApplicationReducer;