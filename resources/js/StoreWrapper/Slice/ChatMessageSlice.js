import {createSlice} from '@reduxjs/toolkit';
import chatMessageState from '../InitialState/chatMessageState';
import ChatMessageReducer  from '../Reducer/ChatMessageReducer';
 
//Creating slice for message list state
const ChatMessageSlice = createSlice(
{
	name:'messageList',
	initialState:chatMessageState,
	reducers:ChatMessageReducer,
});

export const {updateChatMessageState} = ChatMessageSlice.actions;
export default ChatMessageSlice.reducer;