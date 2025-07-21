import {createSlice} from '@reduxjs/toolkit';
import jobState from '../InitialState/jobState';
import JobReducer  from '../Reducer/JobReducer';
 
//Creating slice for post list state
const UserJobSlice = createSlice(
{
	name:'userJobList',
	initialState:jobState,
	reducers:JobReducer,
});

export const {updateJobState} = UserJobSlice.actions;
export default UserJobSlice.reducer;