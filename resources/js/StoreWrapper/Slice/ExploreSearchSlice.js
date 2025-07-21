import {createSlice} from '@reduxjs/toolkit';
import exploreSearchState from '../InitialState/exploreSearchState';
import ExploreSearchReducer from '../Reducer/ExploreSearchReducer';
 
//Creating slice for  Explore Job Filter
const ExploreSearchSlice = createSlice(
{
	name:'exploreSearch',
	initialState:exploreSearchState,
	reducers:ExploreSearchReducer,
});

export const {updateExploreSearchState} = ExploreSearchSlice.actions;
export default ExploreSearchSlice.reducer;