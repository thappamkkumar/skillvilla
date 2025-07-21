import { createSlice } from '@reduxjs/toolkit';
import userNavState from '../InitialState/userNavState';
import userNavBarReducer from '../Reducer/userNavBarReducer';

const userNavBarSlice = createSlice({
    name: 'userNavBar',
    initialState: userNavState,
    reducers: userNavBarReducer, 
});

export const { userNavBarToggle, setActiveLink } = userNavBarSlice.actions;
export default userNavBarSlice.reducer;
