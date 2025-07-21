//reducer for Freelance List  
 
const FreelanceReducer = { 
    updateFreelanceState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetFreelance": 
					 
							state.freelanceList = [...state.freelanceList, ...action.payload.freelanceList];
						  break;  
				
				case "addNewFreelance": 
					 
							state.freelanceList = [ action.payload.newFreelance, ...state.freelanceList];
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
						
					 case "increamentFreelanceBidCount":
					 {
							state.freelanceList	 = state.freelanceList.map(freelance => {
									if (freelance.id ==  action.payload.freelanceCount.freelance_id) {
										return {
												...freelance,
												bids_count:action.payload.freelanceCount.bids_count,
										};
									}
									return freelance;
							});
					 
							break;
					 }
						
						case "updateHirerReviewStats":
						{
							const {avg_rating,   hirer_id, review_count} = action.payload.hirerRivewStats;
							
							state.freelanceList	 = state.freelanceList.map(freelance => {
								if (freelance.user && freelance.user.id == hirer_id ) {
										return {
												...freelance,
												user: 
												{
														...freelance.user,
														hirer_review_stats: 
														{
															review_count:review_count,
															avg_rating:avg_rating,
														},
												}
										};
									}
									return freelance;
							});
					 
							break;
						}
					 
					 
					
					
					case "updatedFreelance":
						state.freelanceList = state.freelanceList.map(freelance => {
								if (freelance.id === action.payload.updatedFreelance.id) 
								{
										return  action.payload.updatedFreelance;
								}
								return freelance;
						});
						break;
						
						
						
					case "bidPlaced":
						state.freelanceList = state.freelanceList.map(freelance => {
								if (freelance.id === action.payload.freelance_id) {
										return {
												...freelance, 
												already_bid:true,
										};
								}
								return freelance;
						});
						break;
						
						case "updateFreelanceSaves":
						state.freelanceList = state.freelanceList.map(freelance => {
								if (freelance.id === action.payload.savedData.freelance_id) {
										return {
												...freelance,
												has_saved: action.payload.savedData.has_saved 
										};
								}
								return freelance;
						});
						break;
						
						
					case "deleteFreelance":
						const updatedItems = state.freelanceList.map(item => {
							if (item.id === action.payload.freelance_id) 
							{   
								return { id: item.id, deleted: true };    
							}
							return item;
						});
						state.freelanceList = updatedItems;
						break;
					
					default:
							 state.freelanceList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
			}
		},
		 
     
}


export default FreelanceReducer;