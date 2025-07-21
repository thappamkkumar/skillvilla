//reducer for job List  
 
const JobReducer = { 
    updateJobState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetJob": 
					 
							state.jobList = [...state.jobList, ...action.payload.jobList];
						  break;  
				
				case "addNewJob": 
					 
							state.jobList = [ action.payload.newJob, ...state.jobList];
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
						
					case "updatedJob":
						state.jobList = state.jobList.map(job => {
								if (job.id === action.payload.updatedJob.id) 
								{
										return  action.payload.updatedJob;
								}
								return job;
						});
						break;	
					
					
					 case "increamentJobApplicationCount":
							state.jobList	 = state.jobList.map(job => {
									if (job.id ==  action.payload.jobCount.job_id) {
										return {
												...job,
												applications_count:action.payload.jobCount.applications_count,
										};
									}
									return job;
							});
					 
						break;
						
					 
					 
					case "deleteJob":
						const updatedItems = state.jobList.map(item => {
							if (item.id === action.payload.job_id) 
							{   
								return { id: item.id, deleted: true };    
							}
							return item;
						});
						state.jobList = updatedItems;
						break;
					
					case "updateJobSaves":
						state.jobList = state.jobList.map(job => {
								if (job.id === action.payload.savedData.job_id) {
										return {
												...job,
												has_saved: action.payload.savedData.has_saved 
										};
								}
								return job;
						});
						break;
						
						
					case "updateJobAttempts": 
						const updatedStateJobAttempts = state.jobList.map(job => {
								if (job.id ==  action.payload.attemptData.job_id) {
										return {
												...job,
												attempts: [action.payload.attemptData.attempt, ...job.attempts],
										};
								}
								return job;
						});
						state.jobList = updatedStateJobAttempts;
					break;
					
					case "updateJobAlreadyApplied": 
						const updatedStateJobAlreadyApplied = state.jobList.map(job => {
								if (job.id ==  action.payload.job_id) {
										return {
												...job,
												already_applied:true,
										};
								}
								return job;
						});
						state.jobList = updatedStateJobAlreadyApplied;
					break;
					
					default:
							 state.jobList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
			}
		},
		 
     
}


export default JobReducer;