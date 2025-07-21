import {createSlice} from '@reduxjs/toolkit';
import loginState from '../InitialState/loginState';
import AuthReducer from '../Reducer/AuthReducer';
 
//Creating slice for authentication
const AuthSlice = createSlice(
{
	name:'authUser',
	initialState:loginState,
	reducers:AuthReducer,
});

export const {login, logout, updateProfileImage, updateUserID, updateEmail, updateName} = AuthSlice.actions;
export default AuthSlice.reducer;