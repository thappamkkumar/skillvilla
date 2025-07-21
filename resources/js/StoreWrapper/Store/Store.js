import {configureStore} from '@reduxjs/toolkit';
import RootReducer from '../RootReducer/RootReducer';
 
//configuring rootReducer and creating store

const Store = configureStore({reducer:RootReducer});

export default Store;