import {createSlice} from '@reduxjs/toolkit';
import activeLiveState from '../InitialState/activeLiveState';
import ActiveLiveReducer from '../Reducer/ActiveLiveReducer';
 
//Creating slice for active live list state
const ActiveLiveSlice = createSlice(
{
	name:'activeLiveList',
	initialState:activeLiveState,
	reducers:ActiveLiveReducer,
});

export const {updateActiveLiveState} = ActiveLiveSlice.actions;
export default ActiveLiveSlice.reducer;