import {createSlice} from '@reduxjs/toolkit';
import problemState from '../InitialState/problemState';
import ProblemReducer  from '../Reducer/ProblemReducer';
 
//Creating slice for post list state
const UserProblemSlice = createSlice(
{
	name:'userProblemList',
	initialState:problemState,
	reducers:ProblemReducer,
});

export const {updateProblemState} = UserProblemSlice.actions;
export default UserProblemSlice.reducer;