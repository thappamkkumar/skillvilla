//reducer for explore job filters
 
const ExploreJobFilterReducer = { 
    updateExploreJobFilterState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetFilters":  
							state.filters = {...state.filters, ...action.payload.filter };
						  break;  
					case "SetLocations":  
							state.jobLocations =  action.payload.jobLocations ;
						  break;  
					
				 case "refresh": 
					state.filters = {};
					state.jobLocations = [];
					break;

				default:
					// You can optionally handle the default case if needed
					break;
			}
		},
		 
     
}


export default ExploreJobFilterReducer;