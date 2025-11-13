import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
  
import ActiveLivePage from '../../Pages/Customer/LivePage/ActiveLivePage';
import MyLivePage from '../../Pages/Customer/LivePage/MyLivePage';
import FollowingLivePage from '../../Pages/Customer/LivePage/FollowingLivePage';

const LivesRoutes = () => (
    <> 
			  
				<Route path="lives/my-lives" element={<MyLivePage />} />  
				<Route path="lives/following-lives" element={<FollowingLivePage />} />  
				<Route path="lives/active" element={<ActiveLivePage   />} />  
				
				
			
			{/*Live detail*/}
			<Route path="live/:liveId/detail" element={<h1> Lives detail </h1>} /> 
			
			
		</>
);

export default LivesRoutes;
