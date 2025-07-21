 
import { Route  } from 'react-router-dom';
 

import MessagePage from '../../Pages/Admin/MessagePage/MessagePage';     
 

const AdminMessageRoutes = () => (
    <> 
			<Route path="messages" element={<MessagePage />} />   
			 
		</>
);

export default AdminMessageRoutes;
