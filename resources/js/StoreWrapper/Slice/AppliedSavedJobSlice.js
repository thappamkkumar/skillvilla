import {createSlice} from '@reduxjs/toolkit';
import jobState from '../InitialState/jobState';
import JobReducer  from '../Reducer/JobReducer';
 
//Creating slice  
const AppliedSavedJobSlice = createSlice(
{
	name:'appliedSavedJobList',
	initialState:jobState,
	reducers:JobReducer,
});

export const {updateJobState} = AppliedSavedJobSlice.actions;
export default AppliedSavedJobSlice.reducer;