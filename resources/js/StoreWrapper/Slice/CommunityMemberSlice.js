import {createSlice} from '@reduxjs/toolkit';
import communityMemberState from '../InitialState/communityMemberState';
import CommunityMemberReducer  from '../Reducer/CommunityMemberReducer';
 
//Creating slice for community member list state
const CommunityMemberSlice = createSlice(
{
	name:'communityMemberList',
	initialState:communityMemberState,
	reducers:CommunityMemberReducer,
});

export const {updateCommunityMemberState} = CommunityMemberSlice.actions;
export default CommunityMemberSlice.reducer;