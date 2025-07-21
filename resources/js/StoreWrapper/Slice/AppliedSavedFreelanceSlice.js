import {createSlice} from '@reduxjs/toolkit';
import freelanceState from '../InitialState/freelanceState';
import FreelanceReducer  from '../Reducer/FreelanceReducer';
 
//Creating slice  
const AppliedSavedFreelanceSlice = createSlice(
{
	name:'appliedSavedFreelanceList',
	initialState:freelanceState,
	reducers:FreelanceReducer,
});

export const {updateFreelanceState} = AppliedSavedFreelanceSlice.actions;
export default AppliedSavedFreelanceSlice.reducer;