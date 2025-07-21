import { lazy } from 'react';
import { Route,   } from 'react-router-dom';



import JobDetailPage from '../../Pages/Customer/JobPage/JobDetailPage'; 
import JobApplicationDetailPage from '../../Pages/Customer/JobPage/JobApplicationDetailPage'; 
import AddJobVacancyPage from '../../Pages/Customer/JobPage/AddJobVacancyPage'; 
import UpdateJobVacancyPage from '../../Pages/Customer/JobPage/UpdateJobVacancyPage'; 
import JobApplyPage from '../../Pages/Customer/JobPage/JobApplyPage'; 
  

const JobPage = lazy(() => import('../../Pages/Customer/JobPage/JobPage')); 
const AppliedJobPage = lazy(() => import('../../Pages/Customer/JobPage/AppliedJobPage')); 
const SavedJobPage = lazy(() => import('../../Pages/Customer/JobPage/SavedJobPage')); 
const MyJobPage = lazy(() => import('../../Pages/Customer/JobPage/MyJobPage')); 
const UserJobPage = lazy(() => import('../../Pages/Customer/JobPage/UserJobPage')); 
const JobApplicationPage = lazy(() => import('../../Pages/Customer/JobPage/JobApplicationPage')); 

const JobsRoutes = () => (
    <> 
			<Route path="jobs/post-new" element={<AddJobVacancyPage />} />
			<Route path="job-update/:job_id" element={<UpdateJobVacancyPage />} />
			
			<Route path="jobs" element={<JobPage />} />
			<Route path="jobs/applied" element={<AppliedJobPage />} />
			<Route path="jobs/saved" element={<SavedJobPage />} />
			<Route path="jobs/my-jobs" element={<MyJobPage />} />
			<Route path="user/:userId/:ID/jobs" element={<UserJobPage />} />
			<Route path="job-detail/:job_id" element={<JobDetailPage />} />
			
			<Route path="job-apply/:job_id" element={<JobApplyPage />} />
			<Route path="job-applications/:job_id" element={<JobApplicationPage />} />
			<Route path="job-application-detail/:job_application_id" element={<JobApplicationDetailPage />} />
										
										  					
		</>
);

export default JobsRoutes;
