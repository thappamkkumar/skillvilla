import {createSlice} from '@reduxjs/toolkit';
import problemState from '../InitialState/problemState';
import ProblemReducer  from '../Reducer/ProblemReducer';
 
//Creating slice for post list state
const MyProblemSlice = createSlice(
{
	name:'myProblemList',
	initialState:problemState,
	reducers:ProblemReducer,
});

export const {updateProblemState} = MyProblemSlice.actions;
export default MyProblemSlice.reducer;