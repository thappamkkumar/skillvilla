import {createSlice} from '@reduxjs/toolkit';
import userState from '../InitialState/userState';
import UserReducer  from '../Reducer/UserReducer';
 
//Creating slice for user  list state
const UserSlice = createSlice(
{
	name:'userList',
	initialState:userState,
	reducers:UserReducer,
});

export const {updateUserState} = UserSlice.actions;
export default UserSlice.reducer;