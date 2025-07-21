 
import   {useEffect, useState, useCallback, memo }  from 'react'; 
import {useDispatch, useSelector } from 'react-redux';  
 
   
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice'; 

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 

import FeedList from '../../../Components/Customer/Home/FeedList.jsx'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PostComments from '../../../Components/Customer/PostComment/PostComments'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 
import serverConnection from '../../../CustomHook/serverConnection';  

//post websocket
import usePostLikeWebsocket from '../../../Websockets/Post/usePostLikeWebsocket'; 
import usePostCommentCountWebsocket from '../../../Websockets/Post/usePostCommentCountWebsocket'; 
import usePostDeleteWebsocket from '../../../Websockets/Post/usePostDeleteWebsocket'; 
//workfolio websocket
import useWorkfolioAvgCountWebsocket from '../../../Websockets/Workfolio/useWorkfolioAvgCountWebsocket'; 
import useWorkfolioDeleteWebsocket from '../../../Websockets/Workfolio/useWorkfolioDeleteWebsocket'; 
//problem websocket
import useProblemSolutionCountWebsocket from '../../../Websockets/Problem/useProblemSolutionCountWebsocket'; 
import useProblemDeleteWebsocket from '../../../Websockets/Problem/useProblemDeleteWebsocket'; 
//job websocket
import useJobDeleteWebsocket from '../../../Websockets/Job/useJobDeleteWebsocket'; 
//freelance websocket 
import useFreelanceDeleteWebsocket from '../../../Websockets/Freelance/useFreelanceDeleteWebsocket'; 
 



const Home = ()=> { 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info
	const feedList = useSelector((state) => state.feedList); //selecting feed List from store
	const commentStatus = useSelector((state) => state.commentList.commentStatus); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const [loading, setLoading] = useState(false);
	
	/* Call the   hook for websockets event listeners*/
	
	//Post
	usePostLikeWebsocket(loggedUserData);
	usePostCommentCountWebsocket(loggedUserData);
	usePostDeleteWebsocket(loggedUserData);
	//websocket
	useWorkfolioAvgCountWebsocket(loggedUserData);
	useWorkfolioDeleteWebsocket(loggedUserData);
	//problem
	useProblemSolutionCountWebsocket(loggedUserData);
	useProblemDeleteWebsocket(loggedUserData);
	//Job
	useJobDeleteWebsocket( loggedUserData );
	//freelance 
	useFreelanceDeleteWebsocket( loggedUserData ); 
		
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		if(!authToken)return;
		try
		{
			setLoading(true);
			//call the function fetcg post data fron server
			let response = await serverConnection(`/get-feeds`, { cursor: feedList.cursor}, authToken);
			//update the post state in redux.
			//console.log(response);
			if(response )
			{
				if(response.feedData.length != 0 )
				{
					dispatch(updateFeedState({type : 'SetFeeds', feedList: response.feedData}));  
				}
				dispatch(updateFeedState({type : 'SetCursor', cursor: response.next_cursor})); 
				dispatch(updateFeedState({type : 'SetHasMore', hasMore: response.hasMore})); 
				  
			}  
			
		}
		catch(error)
		{
			console.log(error); 
		}
		finally
		{
			 setLoading(false);
		}
			
	},[dispatch, authToken, feedList.cursor]); 

	useEffect(() => { 
		 
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		
		if(feedList.feedList.length == 0)
		{ 
			apiCall(); 
		}  
		
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, feedList.feedList.length]);
	
	 
	  
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateFeedState({type : 'SetScrollHeightPosition', scrollHeightPosition: scrollTop})); 
    
  }, [dispatch]); 
	 
 	 
	 
	 
	return ( 
		<>
			{/*for SEO, change document title and meta data (name and description of meta data)*/}
			<PageSeo 
        title="Home | SkillVilla"
        description="Discover professional posts, workfolios, problems to solve, and freelance gigs — all in one place. Connect, showcase, and grow on SkillVilla."
        keywords="posts, portfolios, freelance gigs, professional, media"
      />
			  
			
			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={feedList.hasMore}
				loading={loading}
				initialScrollPosition={feedList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			>  
			
				<FeedList feedList={feedList.feedList} />
				
				{/*component for share post with user or community or copy link*/}
				<Share />
				{
					commentStatus && <PostComments />
				}
			</InfiniteScrollContainer>
		</>
	);
};

export default memo(Home);
