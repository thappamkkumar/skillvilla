import {createSlice} from '@reduxjs/toolkit';
import shareStatsState from '../InitialState/shareStatsState';
import ShareStatsReducer  from '../Reducer/ShareStatsReducer';
 
//Creating slice for Share Stats 
const ShareStatsSlice = createSlice(
{
	name:'shareStats',
	initialState:shareStatsState,
	reducers:ShareStatsReducer,
});

export const {updateShareStatsState} = ShareStatsSlice.actions;
export default ShareStatsSlice.reducer;