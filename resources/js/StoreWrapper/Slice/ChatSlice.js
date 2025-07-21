import {createSlice} from '@reduxjs/toolkit';
import chatState from '../InitialState/chatState';
import ChatReducer  from '../Reducer/ChatReducer';
 
//Creating slice for post list state
const ChatSlice = createSlice(
{
	name:'chatList',
	initialState:chatState,
	reducers:ChatReducer,
});

export const {updateChatState} = ChatSlice.actions;
export default ChatSlice.reducer;