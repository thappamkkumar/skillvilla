import { Route, Navigate } from 'react-router-dom';
import ExplorePage from '../../Pages/Customer/ExplorePage/ExplorePage';
import ExploreCommunityPage from '../../Pages/Customer/ExplorePage/ExploreCommunityPage';
import ExploreUserPage from '../../Pages/Customer/ExplorePage/ExploreUserPage';
import ExplorePostPage from '../../Pages/Customer/ExplorePage/ExplorePostPage';
import ExploreWorkfolioPage from '../../Pages/Customer/ExplorePage/ExploreWorkfolioPage';
import ExploreProblemPage from '../../Pages/Customer/ExplorePage/ExploreProblemPage';
import ExploreJobPage from '../../Pages/Customer/ExplorePage/ExploreJobPage';
import ExploreFreelancePage from '../../Pages/Customer/ExplorePage/ExploreFreelancePage';

const ExploreRoutes = () => (
    <Route path="explore" element={<ExplorePage />}>
			{/* Default Redirect to /explore/posts */}
			<Route index element={<Navigate to="users"   />} />
			
			<Route path="communities" element={<ExploreCommunityPage />} />
			<Route path="users" element={<ExploreUserPage />} />
			<Route path="posts" element={<ExplorePostPage />} />
			<Route path="workfolio" element={<ExploreWorkfolioPage />} />
			<Route path="problems" element={<ExploreProblemPage />} />
			<Route path="jobs" element={<ExploreJobPage />} />
			<Route path="freelance" element={<ExploreFreelancePage />} />
			<Route path="lives" element={<h1>Explore/Lives</h1>} />
			<Route path="lives" element={<h1>Explore/Lives</h1>} />
		</Route>
);

export default ExploreRoutes;
