import {createSlice} from '@reduxjs/toolkit';
import communityState from '../InitialState/communityState';
import CommunityReducer  from '../Reducer/CommunityReducer';
 
//Creating slice for Community list state
const YourCommunitySlice = createSlice(
{
	name:'yourCommunityList',
	initialState:communityState,
	reducers:CommunityReducer,
});

export const {updateCommunityState} = YourCommunitySlice.actions;
export default YourCommunitySlice.reducer;