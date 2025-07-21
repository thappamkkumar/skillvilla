import {createSlice} from '@reduxjs/toolkit';
import storiesState from '../InitialState/storiesState';
import StoriesReducer  from '../Reducer/StoriesReducer';
 
//Creating slice for problem list state
const StoriesSlice = createSlice(
{
	name:'storiesState',
	initialState:storiesState,
	reducers:StoriesReducer,
});

export const {updateStoriesState} = StoriesSlice.actions;
export default StoriesSlice.reducer;