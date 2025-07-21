import {createSlice} from '@reduxjs/toolkit';
import workfolioState from '../InitialState/workfolioState';
import WorkfolioReducer  from '../Reducer/WorkfolioReducer';
 
//Creating slice for workfolio list state
const SavedWorkfolioSlice = createSlice(
{
	name:'savedWorkfolioList',
	initialState:workfolioState,
	reducers:WorkfolioReducer,
});

export const {updateWorkfolioState} = SavedWorkfolioSlice.actions;
export default SavedWorkfolioSlice.reducer;