 
import { Route  } from 'react-router-dom';
 

import PostPage from '../../Pages/Admin/PostPage/PostPage';     
import PostDetailPage from '../../Pages/Admin/PostPage/PostDetailPage';     
 
 

const PostRoutes = () => (
    <> 
		 <Route path="posts" element={<PostPage />} />   
		 <Route path="post-detail/:postId" element={<PostDetailPage />} />   
		</>
);

export default PostRoutes;
