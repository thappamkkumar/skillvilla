import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
 

import AddStoriesPage from '../../Pages/Customer/StoriesPage/AddStoriesPage';
import StoriesDetailPage from '../../Pages/Customer/StoriesPage/StoriesDetailPage'; 


const StoriesPage = lazy(() => import('../../Pages/Customer/StoriesPage/StoriesPage')); 
 
 

const StoriesRoutes = () => (
    <> 
													
			<Route path="stories" element={<StoriesPage />} /> 
			<Route path="stories/add-new" element={<AddStoriesPage />} />
			<Route path="stories/:user_id/detail" element={<StoriesDetailPage />} />
			
		</>
);

export default StoriesRoutes;
