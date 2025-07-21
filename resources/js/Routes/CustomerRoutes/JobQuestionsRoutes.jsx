import { lazy } from 'react';
import { Route } from 'react-router-dom';



import AddJobVacancyQuestionsPage from '../../Pages/Customer/JobPage/Question/AddJobVacancyQuestionsPage'; 

const JobQuestionsRoutes = () => (
    <> 
			<Route path="job-add-questions/:job_id" element={<AddJobVacancyQuestionsPage />} />  					
		</>
);

export default JobQuestionsRoutes;
