//reducer for explore search
 
const ExploreSearchReducer = { 
    updateExploreSearchState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetSearchInput":  
					 
							state.searchInput = action.payload.searchInput;
							state.searching = true;
						  break;  
					   
					
				 case "refresh": 
					state.searchInput = "";
					state.searching = false;
					 
					break;

				default:
					// You can optionally handle the default case if needed
					break;
			}
		},
		 
     
}


export default ExploreSearchReducer;