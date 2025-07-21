import {createSlice} from '@reduxjs/toolkit';
import communityDetailState from '../InitialState/communityDetailState';
import CommunityDetailReducer  from '../Reducer/CommunityDetailReducer';
 
//Creating slice for community detail
const CommunityDetailSlice= createSlice(
{
	name:'communityDetail',
	initialState:communityDetailState,
	reducers:CommunityDetailReducer,
});

export const {updateCommunityDetailState} = CommunityDetailSlice.actions;
export default CommunityDetailSlice.reducer;