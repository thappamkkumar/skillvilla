//reducer for authentication
const AuthReducer = { 
    login(state, action)
    {
			state.is_login = true;
			state.token = action.payload.token;
			state.user = action.payload.user; 
		},
		
    logout(state)
    {
			state.is_login = false;
			state.token = null;
			state.user = null; 
		},
		updateProfileImage(state, action)
		{
			let userData = JSON.parse(state.user);
			if(userData.customer != null)
			{
				userData.customer.image = action.payload.image;
			}
			 
			state.user = JSON.stringify(userData);
			
			sessionStorage.setItem('user',JSON.stringify(userData));
		},
		updateUserID(state, action)
		{
			let userData = JSON.parse(state.user);
			userData.userID = action.payload.userID;
			state.user = JSON.stringify(userData); 
			
			sessionStorage.setItem('user',JSON.stringify(userData));
			 
		},
		updateEmail(state, action)
		{
			let userData = JSON.parse(state.user);
			userData.email = action.payload.email;
			state.user = JSON.stringify(userData); 
			
			sessionStorage.setItem('user',JSON.stringify(userData));
			 
		},
		updateName(state, action)
		{
			let userData = JSON.parse(state.user);
			userData.name = action.payload.name;
			state.user = JSON.stringify(userData); 
			sessionStorage.setItem('user',JSON.stringify(userData));
			 
		}
}


export default AuthReducer;