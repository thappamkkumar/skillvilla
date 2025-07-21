 
import { Route  } from 'react-router-dom';
 

import StoryPage from '../../Pages/Admin/StoryPage/StoryPage';   
import StoryDetailPage from '../../Pages/Admin/StoryPage/StoryDetailPage';   
 
 

const StoryRoutes = () => (
    <> 
		 <Route path="stories" element={<StoryPage />} />  
		 <Route path="story-detail/:storyId" element={<StoryDetailPage />} />  
		</>
);

export default StoryRoutes;
