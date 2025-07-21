 
import { Route  } from 'react-router-dom';
 

import JobPage from '../../Pages/Admin/JobPage/JobPage';     
import JobDetailPage from '../../Pages/Admin/JobPage/JobDetailPage';     
 

const JobRoutes = () => (
    <> 
			<Route path="jobs" element={<JobPage />} />   
			<Route path="job-detail/:job_id" element={<JobDetailPage />} />
		</>
);

export default JobRoutes;
