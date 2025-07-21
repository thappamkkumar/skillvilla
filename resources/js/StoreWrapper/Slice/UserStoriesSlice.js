import {createSlice} from '@reduxjs/toolkit';
import storiesState from '../InitialState/storiesState';
import StoriesReducer  from '../Reducer/StoriesReducer';
 
//Creating slice for post list state
const UserStoriesSlice = createSlice(
{
	name:'userStoriesList',
	initialState:storiesState,
	reducers:StoriesReducer,
});

export const {updateStoriesState} = UserStoriesSlice.actions;
export default UserStoriesSlice.reducer;