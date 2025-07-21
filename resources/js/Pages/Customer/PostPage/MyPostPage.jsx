 
import   {useEffect, useState, useCallback }  from 'react'; 
import {useDispatch, useSelector } from 'react-redux';  
   
import { updatePostState as updateMyPostState } from '../../../StoreWrapper/Slice/MyPostSlice'; 


import PostList from '../../../Components/Customer/PostList/PostList';
import PostComments from '../../../Components/Customer/PostComment/PostComments';   
import PostHeader from '../../../Components/Customer/PostList/PostHeader'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 
import serverConnection from '../../../CustomHook/serverConnection';  

import usePostLikeWebsocket from '../../../Websockets/Post/usePostLikeWebsocket'; 
import usePostCommentCountWebsocket from '../../../Websockets/Post/usePostCommentCountWebsocket'; 
//import usePostDeleteWebsocket from '../../../Websockets/Post/usePostDeleteWebsocket'; 


const MyPostPage = () => { 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info
	const commentStatus = useSelector((state) => state.commentList.commentStatus); //selecting token from store
	const postList = useSelector((state) => state.myPostList); //selecting post List from store
	const [loading, setLoading] = useState(false);
	  
	
		
	// Call the   hook for websockets event listeners 
	usePostLikeWebsocket(loggedUserData);
	usePostCommentCountWebsocket(loggedUserData);
	//usePostDeleteWebsocket(loggedUserData);

		
		
		
	 
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		if(authToken == null) return;
		try
		{
			 
			setLoading(true);
			//call the function fetcg post data fron server
			 
			let data =await serverConnection(`/get-user-post-list?cursor=${postList.cursor}`, {userId: null}, authToken);
			//update the post state in redux.
			 //console.log(data);
			if(data != null && data.postList != null )
			{
				if(data.postList.data.length != 0 )
				{
					dispatch(updateMyPostState({type : 'SetPosts', postList: data.postList.data}));  
				}
				dispatch(updateMyPostState({type : 'SetCursor', cursor: data.postList.next_cursor})); 
				dispatch(updateMyPostState({type : 'SetHasMore', hasMore: data.postList.next_cursor != null})); 
			}
			
		}
		catch(error)
		{
			//console.log(error);
			 
		}
		finally
		{
			 setLoading(false);
		}
			
	},[authToken, dispatch, postList]); 

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
	}, [authToken, postList.postList.length]);
	
	
	
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateMyPostState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop})); 
    
  }, [dispatch]); 
	 
	 	 
	 
	 
	return ( 
		<>
			<PageSeo 
				title="My Posts | SkillVilla"
				description="Manage and view your posts on SkillVilla."
				keywords="my posts, user posts, SkillVilla, posted content"
			/>

			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={postList.hasMore}
				loading={loading}
				initialScrollPosition={postList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			> 
				<PostHeader heading="My Posts" myPost={true}/> 
				{
					 (postList.postList.length <= 0 && !loading) ?
					 ( 
							<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<p className="no_posts_message ">
							You haven't posted anything yet. Share your first post! 
							</p>
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

export default MyPostPage;
