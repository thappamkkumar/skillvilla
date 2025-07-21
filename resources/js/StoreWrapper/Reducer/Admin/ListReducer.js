//reducer for   List
 
const ListReducer = { 
    updateListState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetData":  
					 
							state.data =   action.payload.listData ;
						  break;   
					
					case "SetNextPageUrl":
							state.nextPageUrl = action.payload.nextPageUrl;
							break;

					case "SetPrevPageUrl":
							state.prevPageUrl = action.payload.prevPageUrl;
							break;

							
					case "SetHasMore":
							state.hasMore = action.payload.hasMore;
							break;
							 
					
					case "updateUserActiveStatus":
						state.data = state.data.map(item => {
								if (item.id === action.payload.statusData.user_id) {
										return {
												...item,
												is_active: action.payload.statusData.status
										};
								}
								return item;
						});
						break;

					case "ItemDelete":
						state.data = state.data.filter(item =>  item.id != action.payload.deleted_id); 
						break;
					
					case "refresh":
							state.data = []; 
							state.nextPageUrl = null;
							state.prevPageUrl = null;
							state.hasMore = false; 
						break;
						 
					
					default:
							
							break;
			}
		},
		 
     
}


export default ListReducer;