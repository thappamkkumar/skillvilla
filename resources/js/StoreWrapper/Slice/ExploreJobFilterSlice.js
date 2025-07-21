import {createSlice} from '@reduxjs/toolkit';
import exploreJobFilterState from '../InitialState/exploreJobFilterState';
import ExploreJobFilterReducer from '../Reducer/ExploreJobFilterReducer';
 
//Creating slice for  Explore Job Filter
const ExploreJobFilterSlice = createSlice(
{
	name:'exploreJobFilter',
	initialState:exploreJobFilterState,
	reducers:ExploreJobFilterReducer,
});

export const {updateExploreJobFilterState} = ExploreJobFilterSlice.actions;
export default ExploreJobFilterSlice.reducer;