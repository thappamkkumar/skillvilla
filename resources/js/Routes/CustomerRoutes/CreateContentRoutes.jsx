 
import { Route, Navigate } from 'react-router-dom';
import CreatePage from '../../Pages/Customer/CreatePage/CreatePage'
import UploadNewPostPage from '../../Pages/Customer/PostPage/UploadNewPostPage';
import AddWorkPage from '../../Pages/Customer/WorkfolioPage/AddWorkPage';
import AddProblemPage from '../../Pages/Customer/ProblemPage/AddProblemPage';
import AddJobVacancyPage from '../../Pages/Customer/JobPage/AddJobVacancyPage'; 
import AddFreelanceWorkPage from '../../Pages/Customer/FreelancePage/AddFreelanceWorkPage';
import AddNewCommunityPage from '../../Pages/Customer/CommunityPage/AddNewCommunityPage';
import RegisterCompanyPage from '../../Pages/Customer/CompanyPage/RegisterCompanyPage';
import AddStoriesPage from '../../Pages/Customer/StoriesPage/AddStoriesPage';
  

const CreateContentRoutes = () => (
    <Route path="create" element={<CreatePage />}>
			{/* Default Redirect to /create/posts */}
			<Route index element={<Navigate to="post"   />} /> 
			 
			<Route path="post" element={<UploadNewPostPage />} />
			<Route path="workfolio" element={<AddWorkPage />} />
			<Route path="problem" element={<AddProblemPage />} />
			<Route path="job" element={<AddJobVacancyPage />} />
			<Route path="job/register-company" element={<RegisterCompanyPage />} />
			<Route path="freelance" element={<AddFreelanceWorkPage />} /> 
			<Route path="community" element={<AddNewCommunityPage />} /> 
			<Route path="story" element={<AddStoriesPage />} />
		</Route>
);

export default CreateContentRoutes;
