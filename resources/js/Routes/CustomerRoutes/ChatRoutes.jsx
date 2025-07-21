import { Route, Navigate } from 'react-router-dom';

import ChatPage from '../../Pages/Customer/ChatPage/ChatPage';
import ChatBoxPage from '../../Pages/Customer/ChatPage/ChatBoxPage';

const ChatRoutes = () => (
    <>
			<Route path="chats" element={<ChatPage />}  >
				<Route path=":chatId" element={<ChatBoxPage />}  /> {/* Large Screen */}
			</Route>
			<Route path="chat/:chatId" element={<ChatBoxPage />} /> {/* Small Screen */}
		</>
);

export default ChatRoutes;
