import {createSlice} from '@reduxjs/toolkit';
import feedState from '../InitialState/feedState';
import FeedReducer from '../Reducer/FeedReducer';
 
//Creating slice for feed list state
const FeedSlice = createSlice(
{
	name:'feedList',
	initialState:feedState,
	reducers:FeedReducer,
});

export const {updateFeedState} = FeedSlice.actions;
export default FeedSlice.reducer;