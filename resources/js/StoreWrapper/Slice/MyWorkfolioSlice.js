import {createSlice} from '@reduxjs/toolkit';
import workfolioState from '../InitialState/workfolioState';
import WorkfolioReducer  from '../Reducer/WorkfolioReducer';
 
//Creating slice for post list state
const MyWorkfolioSlice = createSlice(
{
	name:'myWorkfolioList',
	initialState:workfolioState,
	reducers:WorkfolioReducer,
});

export const {updateWorkfolioState} = MyWorkfolioSlice.actions;
export default MyWorkfolioSlice.reducer;