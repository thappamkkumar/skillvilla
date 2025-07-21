import {createSlice} from '@reduxjs/toolkit';
import problemState from '../InitialState/problemState';
import ProblemReducer  from '../Reducer/ProblemReducer';
 
//Creating slice for problem list state
const SavedProblemSlice = createSlice(
{
	name:'savedProblemState',
	initialState:problemState,
	reducers:ProblemReducer,
});

export const {updateProblemState} = SavedProblemSlice.actions;
export default SavedProblemSlice.reducer;