import {createSlice} from '@reduxjs/toolkit';
import workfolioState from '../InitialState/workfolioState';
import WorkfolioReducer  from '../Reducer/WorkfolioReducer';
 
//Creating slice for post list state
const UserWorkfolioSlice = createSlice(
{
	name:'userWorkfolioList',
	initialState:workfolioState,
	reducers:WorkfolioReducer,
});

export const {updateWorkfolioState} = UserWorkfolioSlice.actions;
export default UserWorkfolioSlice.reducer;