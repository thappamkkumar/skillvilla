import {createSlice} from '@reduxjs/toolkit';
import jobApplicationState from '../InitialState/jobApplicationState';
import JobApplicationReducer  from '../Reducer/JobApplicationReducer';
 
//Creating slice for post list state
const JobApplicationSlice = createSlice(
{
	name:'jobApplicationList',
	initialState:jobApplicationState,
	reducers:JobApplicationReducer,
});

export const {updateJobApplicationState} = JobApplicationSlice.actions;
export default JobApplicationSlice.reducer;