import {createSlice} from '@reduxjs/toolkit';
import communityState from '../InitialState/communityState';
import CommunityReducer  from '../Reducer/CommunityReducer';
 
//Creating slice for Community list state
const SuggestionCommunitySlice = createSlice(
{
	name:'suggestionCommunityList',
	initialState:communityState,
	reducers:CommunityReducer,
});

export const {updateCommunityState} = SuggestionCommunitySlice.actions;
export default SuggestionCommunitySlice.reducer;