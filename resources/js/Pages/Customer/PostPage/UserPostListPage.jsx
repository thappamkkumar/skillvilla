 
import   {useEffect, useState, useCallback, useRef }  from 'react';  
import { useParams  } from 'react-router-dom';
import {useDispatch, useSelector } from 'react-redux';   
  
  
import { updatePostState as updateUserPostState  } from '../../../StoreWrapper/Slice/UserPostSlice'; 


import PostList from '../../../Components/Customer/PostList/PostList';
import PostComments from '../../../Components/Customer/PostComment/PostComments';  
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import useAddNewPostWebsocket from '../../../Websockets/Post/useAddNewPostWebsocket'; 
import usePostLikeWebsocket from '../../../Websockets/Post/usePostLikeWebsocket'; 
import usePostCommentCountWebsocket from '../../../Websockets/Post/usePostCommentCountWebsocket'; 
import usePostDeleteWebsocket from '../../../Websockets/Post/usePostDeleteWebsocket'; 

import serverConnection from '../../../CustomHook/serverConnection';  
 
const UserPostListPage = () => { 
	const { userId, ID } = useParams(); // get id from URL parameter
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
 	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info
	const commentStatus = useSelector((state) => state.commentList.commentStatus); //selecting token from store
	const postList = useSelector((state) => state.userPostList); //selecting post List from store
	const [loading, setLoading] = useState(false);
	 
	
		
	/// Call the hook for  websockets event listeners
 	useAddNewPostWebsocket( ID);
	usePostLikeWebsocket(loggedUserData);
	usePostCommentCountWebsocket(loggedUserData);
	usePostDeleteWebsocket(loggedUserData);

	
 
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			if(ID == null)
			{
				return;
			}
			setLoading(true);
			//call the function fetcg post data fron server
			let data = await serverConnection(`/get-user-post-list?cursor=${postList.cursor}`, {userId: ID, }, authToken);
			//update the post state in redux.
			 //console.log(data);
			if(data != null && data.postList != null )
			{
				if(data.postList.data.length != 0 )
				{
					dispatch(updateUserPostState({type : 'SetPosts', postList: data.postList.data}));  
				}
				dispatch(updateUserPostState({type : 'SetCursor', cursor: data.postList.next_cursor})); 
				dispatch(updateUserPostState({type : 'SetHasMore', hasMore: data.postList.next_cursor != null})); 
			}
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
			
	},[dispatch, postList]); 

	useEffect(() => { 
		 
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(postList.postList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [postList.postList.length]);
	
	
	
 	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		dispatch(updateUserPostState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop})); 
	  
  }, [dispatch]); 
	 
	 	 
	 
	
	  
	 
	 
	return ( 
		<>
			<PageSeo 
				title={postList?.postList?.[0]?.user?.name ? `${postList?.postList?.[0]?.user?.name}'s Posts | SkillVilla` : 'User Posts | SkillVilla'}
				
				description={postList?.postList?.[0]?.user?.name ? `Browse posts shared by ${postList?.postList?.[0]?.user?.name} on SkillVilla.` : 'Explore posts from other SkillVilla users.'}
				
				keywords={postList?.postList?.[0]?.user?.name ? `posts, ${postList?.postList?.[0]?.user?.name}, user posts, SkillVilla` : 'user posts, SkillVilla, shared content'}
			/>

			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={postList.hasMore}
				loading={loading}
				initialScrollPosition={postList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			> 
				<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
					<h3 className="fw-bold  ">Recent  Posts </h3>
				</div>
				{
					 (postList.postList.length <= 0 && !loading) ?
					 (
							<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<p className="no_posts_message post my-4">	This user hasn't posted anything yet.</p>
							</div>
					 )
					 :
					 (
							<>
									
								<PostList postList={postList.postList} /> 
							 
							</>
					 )
				} 
			
				
				{
					commentStatus && <PostComments />
				}
				
				{/*component for share post with user or community or copy link*/}
				<Share />
				
			</InfiniteScrollContainer>
		</>
		 
	);
};

export default UserPostListPage;
