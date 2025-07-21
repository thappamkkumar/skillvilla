import {createSlice} from '@reduxjs/toolkit';
import freelanceState from '../InitialState/freelanceState';
import FreelanceReducer  from '../Reducer/FreelanceReducer';
 
//Creating slice for freelance  list state
const FreelanceSlice = createSlice(
{
	name:'freelanceList',
	initialState:freelanceState,
	reducers:FreelanceReducer,
});

export const {updateFreelanceState} = FreelanceSlice.actions;
export default FreelanceSlice.reducer;