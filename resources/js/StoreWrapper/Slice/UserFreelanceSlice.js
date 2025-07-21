import {createSlice} from '@reduxjs/toolkit';
import freelanceState from '../InitialState/freelanceState';
import FreelanceReducer  from '../Reducer/FreelanceReducer';
 
//Creating slice for user Freelance list state
const UserFreelanceSlice = createSlice(
{
	name:'userFreelanceList',
	initialState:freelanceState,
	reducers:FreelanceReducer,
});

export const {updateFreelanceState} = UserFreelanceSlice.actions;
export default UserFreelanceSlice.reducer;