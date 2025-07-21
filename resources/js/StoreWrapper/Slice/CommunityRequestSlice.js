import {createSlice} from '@reduxjs/toolkit';
import communityRequestState from '../InitialState/communityRequestState';
import CommunityRequestReducer  from '../Reducer/CommunityRequestReducer';
 
//Creating slice for community request list state
const CommunityRequestSlice = createSlice(
{
	name:'communityRequestList',
	initialState:communityRequestState,
	reducers:CommunityRequestReducer,
});

export const {updateCommunityRequestState} = CommunityRequestSlice.actions;
export default CommunityRequestSlice.reducer;