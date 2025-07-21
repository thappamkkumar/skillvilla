// Reducer for nav bar toggle
const userNavBarReducer = { 
    userNavBarToggle(state, action)
    { 
			state.toggle = action.payload.toggle; 
		},
    setActiveLink(state, action)
		{
			state.activeLink = action.payload.activeLinkIndex;
		},
     
}

export default userNavBarReducer;
