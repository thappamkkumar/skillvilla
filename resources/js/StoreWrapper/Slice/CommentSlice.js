import {createSlice} from '@reduxjs/toolkit';
import commentState from '../InitialState/commentState';
import CommentReducer from '../Reducer/CommentReducer';
 
//Creating slice for comments on post
const CommentSlice = createSlice(
{
	name:'commentList',
	initialState:commentState,
	reducers:CommentReducer,
});

export const {updateCommentState} = CommentSlice.actions;
export default CommentSlice.reducer;