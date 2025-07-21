import { Routes, Route } from 'react-router-dom';

import AdminLayoutPage from '../Layout/AdminLayoutPage';
import AdminDashboardPage from '../Pages/Admin/DashboardPage/AdminDashboardPage';
import Logout from '../Pages/Auth/Logout';
import PageNotFound from '../Pages/Public/PageNotFound';


import UserRoutes from './AdminRoutes/UserRoutes';
import CommunityRoutes from './AdminRoutes/CommunityRoutes';
import StoryRoutes from './AdminRoutes/StoryRoutes';
import PostRoutes from './AdminRoutes/PostRoutes';
import WorkfolioRoutes from './AdminRoutes/WorkfolioRoutes';
import ProblemRoutes from './AdminRoutes/ProblemRoutes';
import CompanyRoutes from './AdminRoutes/CompanyRoutes';
import JobRoutes from './AdminRoutes/JobRoutes';
import FreelanceRoutes from './AdminRoutes/FreelanceRoutes';
import AdminProfileRoutes from './AdminRoutes/AdminProfileRoutes';
import AdminMessageRoutes from './AdminRoutes/AdminMessageRoutes';

const AdminRoutes = () => {
    return (
        <Routes>
            <Route  element={<AdminLayoutPage />}>
                <Route path="dashboard" element={<AdminDashboardPage />} />
               
							  {UserRoutes()}
							  {CommunityRoutes()}
							  {StoryRoutes()}
							  {PostRoutes()}
							  {WorkfolioRoutes()}
							  {ProblemRoutes()}
							  {CompanyRoutes()}
							  {JobRoutes()}
							  {FreelanceRoutes()}
							  {AdminProfileRoutes()}
							  {AdminMessageRoutes()}
							 
                <Route path="lives" element={<h3>Lives </h3>} />   
                <Route path="logout" element={<Logout />} />
							
								{/*PageNotFound Route */}
								<Route path="*" element={<PageNotFound />} />
							
            </Route>
        </Routes>
    );
};

export default AdminRoutes;
