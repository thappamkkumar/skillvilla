import {createSlice} from '@reduxjs/toolkit';
import jobState from '../InitialState/jobState';
import JobReducer  from '../Reducer/JobReducer';
 
//Creating slice for post list state
const JobSlice = createSlice(
{
	name:'jobList',
	initialState:jobState,
	reducers:JobReducer,
});

export const {updateJobState} = JobSlice.actions;
export default JobSlice.reducer;