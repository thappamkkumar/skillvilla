 
import { Route  } from 'react-router-dom';
 

import UserPage from '../../Pages/Admin/UserPage/UserPage';
import UserProfilePage from '../../Pages/Admin/UserPage/UserProfilePage';
 
 

const UserRoutes = () => (
    <> 
		 <Route path="users" element={<UserPage />} />
		 <Route path="user-profile/:userId/:ID" element={<UserProfilePage />} />
		</>
);

export default UserRoutes;
