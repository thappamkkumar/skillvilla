//reducer for user List  
 
const UserReducer = { 
    updateUserState(state, action)
    {  
			switch (action.payload.type)
			{
					 
					case "SetUsers": 
					 
							state.userList = [...state.userList, ...action.payload.userList];
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
						
					case "refresh":
						state.userList = []; 
						state.cursor = null;
						state.hasMore = false;
						state.scrollHeightPosition = 0;
						break;
						
					   
					
					default: 
							break;
			}
		},
		 
     
}


export default UserReducer;