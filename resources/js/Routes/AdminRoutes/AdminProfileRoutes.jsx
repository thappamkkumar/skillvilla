 
import { Route  } from 'react-router-dom';
 

import AdminProfilePage from '../../Pages/Admin/AdminProfilePage/AdminProfilePage';    
import UpdateAdminProfilePage from '../../Pages/Admin/AdminProfilePage/UpdateAdminProfilePage';    
    
 

const AdminProfileRoutes = () => (
    <> 
			<Route path="profile" element={<AdminProfilePage />} />   
			<Route path="update-profile" element={<UpdateAdminProfilePage />} />   
			 
		</>
);

export default AdminProfileRoutes;
