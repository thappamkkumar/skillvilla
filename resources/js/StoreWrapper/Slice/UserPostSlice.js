import {createSlice} from '@reduxjs/toolkit';
import postState from '../InitialState/postState';
import PostReducer  from '../Reducer/PostReducer';
 
//Creating slice for post list state
const UserPostSlice = createSlice(
{
	name:'userPostList',
	initialState:postState,
	reducers:PostReducer,
});

export const {updatePostState} = UserPostSlice.actions;
export default UserPostSlice.reducer;