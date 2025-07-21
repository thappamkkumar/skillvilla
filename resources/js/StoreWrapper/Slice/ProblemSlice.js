import {createSlice} from '@reduxjs/toolkit';
import problemState from '../InitialState/problemState';
import ProblemReducer  from '../Reducer/ProblemReducer';
 
//Creating slice for problem list state
const ProblemSlice = createSlice(
{
	name:'problemState',
	initialState:problemState,
	reducers:ProblemReducer,
});

export const {updateProblemState} = ProblemSlice.actions;
export default ProblemSlice.reducer;