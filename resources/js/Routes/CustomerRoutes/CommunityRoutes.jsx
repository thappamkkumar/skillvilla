import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';

import CommunityPage from '../../Pages/Customer/CommunityPage/CommunityPage';
import AddNewCommunityPage from '../../Pages/Customer/CommunityPage/AddNewCommunityPage';
import CommunityDetailPage from '../../Pages/Customer/CommunityPage/CommunityDetailPage';
import UpdateCommunityPage from '../../Pages/Customer/CommunityPage/UpdateCommunityPage';
import CommunityChatBoxPage from '../../Pages/Customer/CommunityPage/CommunityChatBoxPage';
import CommunityPostPage from '../../Pages/Customer/CommunityPage/CommunityDetailChildPages/CommunityPostPage';
import CommunityWorkfolioPage from '../../Pages/Customer/CommunityPage/CommunityDetailChildPages/CommunityWorkfolioPage';
import CommunityProblemPage from '../../Pages/Customer/CommunityPage/CommunityDetailChildPages/CommunityProblemPage';
import CommunityJobPage from '../../Pages/Customer/CommunityPage/CommunityDetailChildPages/CommunityJobPage';
import CommunityFreelancePage from '../../Pages/Customer/CommunityPage/CommunityDetailChildPages/CommunityFreelancePage';


// Lazy load the  component  
const YourCommunityList = lazy(() => import('../../Pages/Customer/CommunityPage/CommunityChildPages/YourCommunityList'));
const JoinedCommunityList = lazy(() => import('../../Pages/Customer/CommunityPage/CommunityChildPages/JoinedCommunityList'));
const CommunityMembersPage = lazy(() => import('../../Pages/Customer/CommunityPage/CommunityMembersPage'));
const CommunityRequestsPage = lazy(() => import('../../Pages/Customer/CommunityPage/CommunityRequestsPage'));
 
 
 

const CommunityRoutes = () => (
    <>
			{/*route with child route for community pages */} 
			<Route path="communities" element={<CommunityPage />}  >
			
				{/* Default Redirect to /communities/my-community */}
				<Route index element={<Navigate to="my-community"   />} />
			
				<Route path="my-community" element={<YourCommunityList />} />  
				<Route path="joined-community" element={<JoinedCommunityList />} />  
				
			</Route>
			
			{/*route for add new community page*/}
			<Route path="communities/create-new" element={<AddNewCommunityPage />} /> 
			{/*route for   community chat page*/}
			<Route path="community/:communityId/messages" element={<CommunityChatBoxPage />} /> 
			{/*community update*/}
			<Route path="community/:communityId/update" element={<UpdateCommunityPage />} />
									
									
			{/*route with child route for community detail pages*/}
			<Route path="community/:communityId/detail" element={<CommunityDetailPage />}  > 
			
				{/* Default Redirect to /communities/my-community */}
				<Route index element={<Navigate to="posts"   />} />
			
				<Route path="posts" element={<CommunityPostPage />} />    
				<Route path="workfolio" element={<CommunityWorkfolioPage />} />    
				<Route path="jobs" element={<CommunityJobPage />} />    
				<Route path="problems" element={<CommunityProblemPage />} />    
				<Route path="freelance" element={<CommunityFreelancePage />} /> 
				<Route path="members" element={<CommunityMembersPage />} /> 
				<Route path="requests" element={<CommunityRequestsPage />} /> 
			</Route>
			
			
		</>
);

export default CommunityRoutes;
