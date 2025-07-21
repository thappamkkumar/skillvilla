import {createSlice} from '@reduxjs/toolkit';
import postState from '../InitialState/postState';
import PostReducer from '../Reducer/PostReducer';
  
const TaggedSavedPostSlice = createSlice(
{
	name:'taggedSavedPostList',
	initialState:postState,
	reducers:PostReducer,
});

export const {updatePostState} = TaggedSavedPostSlice.actions;
export default TaggedSavedPostSlice.reducer;