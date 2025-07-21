import { Routes, Route } from 'react-router-dom';
import CustomerLayoutPage from '../Layout/CustomerLayoutPage';
import PageNotFound from '../Pages/Public/PageNotFound';
import Home from '../Pages/Customer/HomePage/Home';

import ExploreRoutes from './CustomerRoutes/ExploreRoutes';
import ChatRoutes from './CustomerRoutes/ChatRoutes';
import CommunityRoutes from './CustomerRoutes/CommunityRoutes';
import StoriesRoutes from './CustomerRoutes/StoriesRoutes';
import LivesRoutes from './CustomerRoutes/LivesRoutes';
import CreateContentRoutes from './CustomerRoutes/CreateContentRoutes';
import PostsRoutes from './CustomerRoutes/PostsRoutes';
import WorkFolioRoutes from './CustomerRoutes/WorkFolioRoutes';
import ProblemRoutes from './CustomerRoutes/ProblemRoutes';
import JobsRoutes from './CustomerRoutes/JobsRoutes';
import JobQuestionsRoutes from './CustomerRoutes/JobQuestionsRoutes';
import CompanyRoutes from './CustomerRoutes/CompanyRoutes';
import FreelanceRoutes from './CustomerRoutes/FreelanceRoutes';
import ProfileRoutes from './CustomerRoutes/ProfileRoutes';

 
import Logout from '../Pages/Auth/Logout';

const CustomerRoutes = () => {
    return (
        <Routes>
            <Route element={<CustomerLayoutPage />}>
                <Route path="home" element={<Home />} />
								
								{ExploreRoutes()}
								{ChatRoutes()}
								{CommunityRoutes()}
								{StoriesRoutes()}
								{LivesRoutes()}
								{CreateContentRoutes()}
								{PostsRoutes()}
								{WorkFolioRoutes()}
								{ProblemRoutes()}
								{JobsRoutes()}
								{JobQuestionsRoutes()}
								{CompanyRoutes()}
								{FreelanceRoutes()}
								{ProfileRoutes()}
                 
                <Route path="logout" element={<Logout />} />
								{/*PageNotFound Route */}
								<Route path="*" element={<PageNotFound />} />
            </Route>
        </Routes>
    );
};

export default CustomerRoutes;
