//reducer for problem List  
 
const FreelanceBidReducer = { 
    updateFreelanceBidState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetFreelanceBid": 
						state.freelanceBidList = [...state.freelanceBidList, ...action.payload.freelanceBidList];
						  break;  
				
				case "SetFreelanceData":  
							state.freelanceData = action.payload.freelanceData;
						  break;  
				
				case "addNewFreelanceBid": 
					 
							state.freelanceBidList = [ action.payload.newFreelanceBid, ...state.freelanceBidList];
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
						
					case 'updateFreelanceBidStatus':
						state.freelanceBidList = state.freelanceBidList.map(freelanceBid => {
								if (freelanceBid.id === action.payload.newStatus.bid_id) {
										return {
												...freelanceBid,
												status: action.payload.newStatus.status 
										};
								}
								return freelanceBid;
						});
						break;
					
					
					case 'updateFreelancerReviewStats':
					{ 	
						const {avg_rating,   freelancer_id, review_count} = action.payload.reviewStats;
						state.freelanceBidList = state.freelanceBidList.map(freelanceBid => {
								if (freelanceBid.user && freelanceBid.user.id ==  freelancer_id) {
										return {
												...freelanceBid,
												user: 
												{
														...freelanceBid.user,
														 
														review_count:review_count,
														avg_rating:avg_rating,
														 
												}
												 
										};
								}
								return freelanceBid;
						});
						break;
					}

					 case 'updateFreelanceBidCount':
						state.freelanceData = {
								...state.freelanceData,
								totalBids: state.freelanceData.totalBids + 1
						};
						break;
						
						
					case 'refresh':
						 state.freelanceBidList = []; 
							 state.freelanceData = {}; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
						break;

					 
						
					default:
							
							break;
			}
		},
		 
     
}


export default FreelanceBidReducer;