 
import { Route  } from 'react-router-dom';
 

import WorkfolioPage from '../../Pages/Admin/WorkfolioPage/WorkfolioPage';     
import WorkFolioDetailPage from '../../Pages/Admin/WorkfolioPage/WorkFolioDetailPage';     
 
 

const WorkfolioRoutes = () => (
    <> 
			<Route path="workfolios" element={<WorkfolioPage />} />   
			 <Route path="workfolio-detail/:workfolio_id" element={<WorkFolioDetailPage />} />  
		</>
);

export default WorkfolioRoutes;
