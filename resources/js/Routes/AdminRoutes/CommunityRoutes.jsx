 
import { Route  } from 'react-router-dom';
 

import CommunityPage from '../../Pages/Admin/CommunityPage/CommunityPage'; 
import CommunityDetailPage from '../../Pages/Admin/CommunityPage/CommunityDetailPage'; 
 
 

const CommunityRoutes = () => (
    <> 
		 <Route path="communities" element={<CommunityPage />} /> 
		 <Route path="community-profile/:communityId" element={<CommunityDetailPage />} /> 
		</>
);

export default CommunityRoutes;
