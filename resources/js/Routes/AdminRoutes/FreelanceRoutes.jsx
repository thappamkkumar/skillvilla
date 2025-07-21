 
import { Route  } from 'react-router-dom';
 

import FreelancePage from '../../Pages/Admin/FreelancePage/FreelancePage';    
import FreelanceDetailPage from '../../Pages/Admin/FreelancePage/FreelanceDetailPage';    
 

const FreelanceRoutes = () => (
    <> 
			<Route path="freelances" element={<FreelancePage />} />   
			<Route path="freelance-detail/:freelance_id" element={<FreelanceDetailPage />} />
		</>
);

export default FreelanceRoutes;
