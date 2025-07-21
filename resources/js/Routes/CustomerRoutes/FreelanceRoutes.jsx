import { lazy } from 'react';
import { Route,   } from 'react-router-dom';
  

import AddFreelanceWorkPage from '../../Pages/Customer/FreelancePage/AddFreelanceWorkPage'; 
import UpdateFreelanceWorkPage from '../../Pages/Customer/FreelancePage/UpdateFreelanceWorkPage'; 
import FreelanceDetailPage from '../../Pages/Customer/FreelancePage/FreelanceDetailPage'; 
  
const FreelancePage = lazy(() => import('../../Pages/Customer/FreelancePage/FreelancePage')); 
const MyFreelancePage = lazy(() => import('../../Pages/Customer/FreelancePage/MyFreelancePage')); 
const UserFreelancePage = lazy(() => import('../../Pages/Customer/FreelancePage/UserFreelancePage')); 
const SavedFreelancePage = lazy(() => import('../../Pages/Customer/FreelancePage/SavedFreelancePage')); 
const AppliedFreelancePage = lazy(() => import('../../Pages/Customer/FreelancePage/AppliedFreelancePage')); 
const FreelanceBidsPage = lazy(() => import('../../Pages/Customer/FreelancePage/FreelanceBidsPage')); 

const FreelanceRoutes = () => (
    <> 
			<Route path="freelance" element={<FreelancePage />} />
			<Route path="freelance/my-freelance" element={<MyFreelancePage />} />
			<Route path="user/:userId/:ID/freelance" element={<UserFreelancePage />} />
			<Route path="freelance/saved" element={<SavedFreelancePage />} />
			<Route path="freelance/applied" element={<AppliedFreelancePage />} />
			<Route path="freelance/add-new" element={<AddFreelanceWorkPage />} /> 
			<Route path="freelance-detail/:freelance_id" element={<FreelanceDetailPage />} /> 
			<Route path="freelance-update/:freelance_id" element={<UpdateFreelanceWorkPage />} /> 
			<Route path="freelance-bids/:freelance_id" element={<FreelanceBidsPage />} /> 
									
		</>
);

export default FreelanceRoutes;
