
import {memo} from 'react';
import { useSelector } from 'react-redux';

import ChatMessages from './ChatMessages';
import ChatMessageInput from './ChatMessageInput';

const ChatPanel = () => {
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	return(
		<div className="overflow-hidden  h-100 d-flex flex-column">
			<ChatMessages />
			<ChatMessageInput />
		</div>
	);

};
export default memo(ChatPanel);

