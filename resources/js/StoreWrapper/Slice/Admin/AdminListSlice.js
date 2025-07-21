import {createSlice} from '@reduxjs/toolkit';
import listState from '../../InitialState/Admin/listState';
import ListReducer from '../../Reducer/Admin/ListReducer';
 
//Creating slice for  admin list state
const AdminListSlice = createSlice(
{
	name:'adminDataList',
	initialState:listState,
	reducers:ListReducer,
});

export const {updateListState} = AdminListSlice.actions;
export default AdminListSlice.reducer;