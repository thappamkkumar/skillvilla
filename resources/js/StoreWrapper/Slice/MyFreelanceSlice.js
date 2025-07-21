import {createSlice} from '@reduxjs/toolkit';
import freelanceState from '../InitialState/freelanceState';
import FreelanceReducer  from '../Reducer/FreelanceReducer';
 
//Creating slice for user Freelance list state
const MyFreelanceSlice = createSlice(
{
	name:'myFreelanceList',
	initialState:freelanceState,
	reducers:FreelanceReducer,
});

export const {updateFreelanceState} = MyFreelanceSlice.actions;
export default MyFreelanceSlice.reducer;