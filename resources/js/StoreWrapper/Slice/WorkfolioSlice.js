import {createSlice} from '@reduxjs/toolkit';
import workfolioState from '../InitialState/workfolioState';
import WorkfolioReducer  from '../Reducer/WorkfolioReducer';
 
//Creating slice for post list state
const WorkfolioSlice = createSlice(
{
	name:'workfolioList',
	initialState:workfolioState,
	reducers:WorkfolioReducer,
});

export const {updateWorkfolioState} = WorkfolioSlice.actions;
export default WorkfolioSlice.reducer;