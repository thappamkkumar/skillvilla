import {createSlice} from '@reduxjs/toolkit';
import postState from '../InitialState/postState';
import PostReducer from '../Reducer/PostReducer';
 
//Creating slice for post list state
const PostSlice = createSlice(
{
	name:'postList',
	initialState:postState,
	reducers:PostReducer,
});

export const {updatePostState} = PostSlice.actions;
export default PostSlice.reducer;