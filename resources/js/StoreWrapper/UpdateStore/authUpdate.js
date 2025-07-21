 
const authUpdate = (is_login, jwtToken, user, rememberMe=false) =>
{ 
	if(is_login)
	{ 
		 
			localStorage.setItem('token',jwtToken);
			localStorage.setItem('user',user);  
		
		// Store rememberMe as a proper boolean string
		localStorage.setItem('rememberMe', JSON.stringify(rememberMe));

		sessionStorage.setItem('is_login', JSON.stringify(is_login));
		
	}
	else
	{ 
		 
		
		//remove session of user data
		localStorage.removeItem('token');
		localStorage.removeItem('user'); 
		localStorage.removeItem('rememberMe'); 
		sessionStorage.removeItem('is_login'); 
	}
	
};

export default authUpdate;