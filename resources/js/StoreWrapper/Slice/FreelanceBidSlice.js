import {createSlice} from '@reduxjs/toolkit';
import freelanceBidState from '../InitialState/freelanceBidState';
import FreelanceBidReducer  from '../Reducer/FreelanceBidReducer';
 
//Creating slice for Freelance Bid list state
const FreelanceBidSlice = createSlice(
{
	name:'freelanceBidList',
	initialState:freelanceBidState,
	reducers:FreelanceBidReducer,
});

export const {updateFreelanceBidState} = FreelanceBidSlice.actions;
export default FreelanceBidSlice.reducer;