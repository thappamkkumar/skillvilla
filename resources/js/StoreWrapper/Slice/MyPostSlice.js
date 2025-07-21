import {createSlice} from '@reduxjs/toolkit';
import postState from '../InitialState/postState';
import PostReducer from '../Reducer/PostReducer';
  
const MyPostSlice = createSlice(
{
	name:'myPostList',
	initialState:postState,
	reducers:PostReducer,
});

export const {updatePostState} = MyPostSlice.actions;
export default MyPostSlice.reducer;