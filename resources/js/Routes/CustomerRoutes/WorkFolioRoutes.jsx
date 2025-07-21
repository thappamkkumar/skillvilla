import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
  
import AddWorkPage from '../../Pages/Customer/WorkfolioPage/AddWorkPage';
import WorkFolioDetailPage from '../../Pages/Customer/WorkfolioPage/WorkFolioDetailPage';

const WorkfolioPage = lazy(() => import('../../Pages/Customer/WorkfolioPage/WorkfolioPage')); 
const MyWorkfolioPage = lazy(() => import('../../Pages/Customer/WorkfolioPage/MyWorkfolioPage')); 
const UserWorkfolioPage = lazy(() => import('../../Pages/Customer/WorkfolioPage/UserWorkfolioPage')); 
const SavedWorkfolioPage = lazy(() => import('../../Pages/Customer/WorkfolioPage/SavedWorkfolioPage')); 


const WorkFolioRoutes = () => (
    <> 
			<Route path="workfolio" element={<WorkfolioPage />} />
			<Route path="workfolio/my-works" element={<MyWorkfolioPage />} />
			<Route path="workfolio/saved" element={<SavedWorkfolioPage />} />
			<Route path="user/:userId/:ID/workfolio" element={<UserWorkfolioPage />} />
			<Route path="workfolio/add-new" element={<AddWorkPage />} />
			<Route path="workfolio-detail/:workfolio_id" element={<WorkFolioDetailPage />} />
		</>
);

export default WorkFolioRoutes;
