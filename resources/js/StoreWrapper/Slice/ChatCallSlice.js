import {createSlice} from '@reduxjs/toolkit';
import chatCallState from '../InitialState/chatCallState';
import ChatCallReducer  from '../Reducer/ChatCallReducer';
 
//Creating slice for chat call state
const ChatCallSlice = createSlice(
{
	name:'chatCallData',
	initialState:chatCallState,
	reducers:ChatCallReducer,
});

export const {updateChatCallState} = ChatCallSlice.actions;
export default ChatCallSlice.reducer;