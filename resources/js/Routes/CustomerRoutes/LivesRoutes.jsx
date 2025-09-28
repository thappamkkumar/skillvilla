import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
  
import LiveStreamPage from '../../Pages/Customer/LiveStreamPage/LiveStreamPage';

const LivesRoutes = () => (
    <> 
			 	{/*route with child route for live pages */} 
			<Route path="lives" element={<LiveStreamPage />}  >
			
				{/* Default Redirect to /communities/my-community */}
				<Route index element={<Navigate to="following"   />} />
			
				<Route path="my-lives" element={<h1> My Live </h1>} />  
				<Route path="active-lives" element={<h1>Active Lives </h1>} />  
				<Route path="following" element={<h1>following Lives </h1>} />  
				
			</Route>	
			
			{/*Live detail*/}
			<Route path="live/:liveId/detail" element={<h1> Lives detail </h1>} /> 
			
			
		</>
);

export default LivesRoutes;
