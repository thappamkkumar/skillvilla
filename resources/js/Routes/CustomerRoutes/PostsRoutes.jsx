 import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
 

import PostDetailPage from '../../Pages/Customer/PostPage/PostDetailPage';
import UploadNewPostPage from '../../Pages/Customer/PostPage/UploadNewPostPage';


const PostPage = lazy(() => import('../../Pages/Customer/PostPage/PostPage')); 
const MyPostPage = lazy(() => import('../../Pages/Customer/PostPage/MyPostPage')); 
const TaggedPostPage = lazy(() => import('../../Pages/Customer/PostPage/TaggedPostPage')); 
const SavedPostPage = lazy(() => import('../../Pages/Customer/PostPage/SavedPostPage')); 
const UserPostListPage = lazy(() => import('../../Pages/Customer/PostPage/UserPostListPage'));

const PostsRoutes = () => (
    <> 
				<Route path="posts" element={<PostPage />} />
				<Route path="posts/my-posts" element={<MyPostPage />} />
				<Route path="post-detail/:postId" element={<PostDetailPage />} />
				<Route path="user/:userId/:ID/posts" element={<UserPostListPage />} />
				<Route path="posts/tagged" element={<TaggedPostPage />} />
				<Route path="posts/saved" element={<SavedPostPage />} />
				<Route path="posts/add-new" element={<UploadNewPostPage />} />
										
										
		</>
);

export default PostsRoutes;
