import {createSlice} from '@reduxjs/toolkit';
import liveStreamState from '../InitialState/liveStreamState';
import LiveStreamReducer from '../Reducer/LiveStreamReducer';

//create slice for live stream
const LiveStreamSlice = createSlice({
	
	name: 'liveStreamData',
	initialState: liveStreamState,
	reducers: LiveStreamReducer,
	
});

export const {updateLiveStreamState} = LiveStreamSlice.actions;
export default LiveStreamSlice.reducer;