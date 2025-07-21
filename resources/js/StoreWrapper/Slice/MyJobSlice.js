import {createSlice} from '@reduxjs/toolkit';
import jobState from '../InitialState/jobState';
import JobReducer  from '../Reducer/JobReducer';
 
//Creating slice for post list state
const MyJobSlice = createSlice(
{
	name:'myJobList',
	initialState:jobState,
	reducers:JobReducer,
});

export const {updateJobState} = MyJobSlice.actions;
export default MyJobSlice.reducer;