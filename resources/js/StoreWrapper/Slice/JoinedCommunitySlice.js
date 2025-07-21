import {createSlice} from '@reduxjs/toolkit';
import communityState from '../InitialState/communityState';
import CommunityReducer  from '../Reducer/CommunityReducer';
 
//Creating slice for Community list state
const JoinedCommunitySlice = createSlice(
{
	name:'joinedCommunityList',
	initialState:communityState,
	reducers:CommunityReducer,
});

export const {updateCommunityState} = JoinedCommunitySlice.actions;
export default JoinedCommunitySlice.reducer;