import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
  
import ActiveLivePage from '../../Pages/Customer/LivePage/ActiveLivePage';
import MyLivePage from '../../Pages/Customer/LivePage/MyLivePage';
import LivePage from '../../Pages/Customer/LivePage/LivePage';

const LivesRoutes = () => (
    <> 
			  
				<Route path="lives/my-lives" element={<MyLivePage />} />  
				<Route path="lives/following-lives" element={<LivePage />} />  
				<Route path="lives/active" element={<ActiveLivePage   />} />  
				
				
			
			{/*Live detail*/}
			<Route path="live/:liveId/detail" element={<h1> Lives detail </h1>} /> 
			
			
		</>
);

export default LivesRoutes;
