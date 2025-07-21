//reducer for workfolio List  
 
const WorkfolioReducer = { 
    updateWorkfolioState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetWorkfolio":  
							state.workfolioList = [...state.workfolioList, ...action.payload.workfolioList]; 
						  break;  
							
					case "addNewWorkfolio":  
							state.workfolioList = [ action.payload.newWorkfolio, ...state.workfolioList];
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
					
					case "updateAvgAndCount":
						const { id, workfolio_review_avg_rating, workfolio_review_count } = action.payload.workfolioAvgANDCount;

						state.workfolioList = state.workfolioList.map((workfolio) =>
								workfolio.id === id
										? { 
												...workfolio, 
												workfolio_review_avg_rating, 
												workfolio_review_count 
											}
										: workfolio
						);
						break;
					case "deleteWorkfolio":
						const updatedItems = state.workfolioList.map(item => {
							if (item.id === action.payload.workfolio_id) 
							{   
								return { id: item.id, deleted: true };    
							}
							return item;
						});
						state.workfolioList = updatedItems;
						break;
					
					case "updateWorkfolioSaves": 
						state.workfolioList = state.workfolioList.map(item => {
								if (item.id === action.payload.savedData.workfolio_id) {
										return {
												...item,
												has_saved: !!action.payload.savedData.status
										};
								}
								return item;
						});
						break;

						
					default:
							 state.workfolioList = []; 
							 state.cursor = null;
							 state.hasMore = false;
							 state.scrollHeightPosition = 0;
							break;
			}
		},
		 
     
}


export default WorkfolioReducer;