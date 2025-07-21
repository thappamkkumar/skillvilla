import {createSlice} from '@reduxjs/toolkit';
import communityMessageState from '../InitialState/communityMessageState';
import CommunityMessageReducer  from '../Reducer/CommunityMessageReducer';
 
//Creating slice for community message list state
const CommunityMessageSlice = createSlice(
{
	name:'communityMessageList',
	initialState:communityMessageState,
	reducers:CommunityMessageReducer,
});

export const {updateCommunityMessageState} = CommunityMessageSlice.actions;
export default CommunityMessageSlice.reducer;