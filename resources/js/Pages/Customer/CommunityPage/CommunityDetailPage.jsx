import {useEffect, useState, useCallback, useRef, memo }  from 'react';  
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"; 
  
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Spinner from 'react-bootstrap/Spinner'; 

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import CommunityDetailHeader from '../../../Components/Customer/CommunityDetail/CommunityDetailHeader';
import CommunityDetailFeedType from '../../../Components/Customer/CommunityDetail/CommunityDetailFeedType';
import NoContentMessage from '../../../Components/Customer/CommunityDetail/NoContentMessage';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
 
import {updatePostState } from '../../../StoreWrapper/Slice/TaggedSavedPostSlice';
import {updateWorkfolioState} from '../../../StoreWrapper/Slice/SavedWorkfolioSlice'; 
import {updateProblemState} from '../../../StoreWrapper/Slice/SavedProblemSlice';
import {updateJobState} from '../../../StoreWrapper/Slice/AppliedSavedJobSlice';
import {updateFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice';
import {updateCommunityDetailState} from '../../../StoreWrapper/Slice/CommunityDetailSlice';
 

import fetchPostForCommunity from './FetchData/fetchPostForCommunity';  
import fetchWorkfolioForCommunity from './FetchData/fetchWorkfolioForCommunity';  
import fetchProblemForCommunity from './FetchData/fetchProblemForCommunity';  
import fetchJobForCommunity from './FetchData/fetchJobForCommunity';  
import fetchFreelanceForCommunity from './FetchData/fetchFreelanceForCommunity'; 
import fetchCommunityDetail from './FetchData/fetchCommunityDetail'; 

import useCommunityMemberCountWebsocket from '../../../Websockets/Community/useCommunityMemberCountWebsocket'; 
import useCommunityRequestCountWebsocket from '../../../Websockets/Community/useCommunityRequestCountWebsocket'; 
import useCommunityRemoveMemberWebsocket from '../../../Websockets/Community/useCommunityRemoveMemberWebsocket'; 
import useCommunityAcceptRequestWebsocket from '../../../Websockets/Community/useCommunityAcceptRequestWebsocket'; 
import useCommunityRequestRejectedWebsocket from '../../../Websockets/Community/useCommunityRequestRejectedWebsocket'; 
import useCommunityRequestCancelWebsocket from '../../../Websockets/Community/useCommunityRequestCancelWebsocket'; 


const CommunityDetailPage = () => {
	const { communityId } = useParams(); 
	const location = useLocation();
  const dispatch = useDispatch();
 	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user)); // get login info
	//redux states 
	const postList = useSelector((state) => state.taggedSavedPostList); //selecting post List from store
	const workfolioList = useSelector((state) => state.savedWorkfolioList); //selecting post List from store
	const problemList = useSelector((state) => state.savedProblemList); //selecting post List from store
	const jobList = useSelector((state) => state.appliedSavedJobList); //selecting post List from store
	const freelanceList = useSelector((state) => state.appliedSavedFreelanceList); //selecting freelance List from store
	const communityDetail = useSelector((state) => state.communityDetail);  
	
	
	
	// Local state 
  const [communityDeleted, setCommunityDeleted] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [loading, setLoading] = useState(false);
   const [hasMore, setHasMore] = useState(false);
	
	
 
 // Call the  hook for websockets event listeners
	useCommunityMemberCountWebsocket(  
		logedUserData,  
		communityId
	);
 useCommunityRequestCountWebsocket(  
		logedUserData,  
		communityId
	);
	//it update community detail state has_joined and also remove member from memberList state
	//no specific need for add in memberPage
 useCommunityRemoveMemberWebsocket(  
		logedUserData,  
		communityId
	);
	useCommunityAcceptRequestWebsocket(  
		logedUserData,  
		communityId
	);
	useCommunityRequestRejectedWebsocket(  
		logedUserData,  
		communityId
	);
	useCommunityRequestCancelWebsocket(  
		logedUserData,  
		communityId
	);
 
 
  
 
 //determine the path and return true or false
	const checkPathMatch = useCallback((key	) => {
		if (location.pathname.includes(`/community/${communityId}/detail/${key}`))
		{
			return true;
			 
		}
		 
		return false;
	}, [location.pathname,communityId]);
 
 



 //get list according to route path and set hasmore  to local state
	useEffect(() => {
			const listMap = { 
					"posts": postList,
					"workfolio": workfolioList,
					"jobs": jobList,
					"problems": problemList,
					"freelance": freelanceList,
			};

			// Get the appropriate list based on the current pathname
			const currentList = Object.keys(listMap).find(path => checkPathMatch(path));

			if (currentList) {
					const list = listMap[currentList]; 
					setHasMore(list.hasMore);
			}

	}, [
			location.pathname,
			checkPathMatch, 
			postList,
			workfolioList,
			jobList,
			problemList,
			freelanceList,
			communityId,
	]);





	
  // Define the fetch function mappings
	 const fetchFunctions = { 
		"posts": (cursor, authToken, dispatch, communityId) => fetchPostForCommunity(setLoading, cursor, authToken, dispatch, communityId),
		
		"workfolio": (cursor, authToken, dispatch, communityId) => fetchWorkfolioForCommunity(setLoading, cursor, authToken, dispatch, communityId),
		
		"jobs": (cursor, authToken, dispatch, communityId ) =>  fetchJobForCommunity(setLoading, cursor, authToken, dispatch, communityId),
		
		"problems": (cursor, authToken, dispatch, communityId) => fetchProblemForCommunity(setLoading, cursor, authToken, dispatch, communityId),
		
		"freelance": (cursor, authToken, dispatch, communityId) => fetchFreelanceForCommunity(setLoading, cursor, authToken, dispatch, communityId),
	};


 // Define a map for which path corresponds to which list's cursor
	const listCursors = { 
		"posts": postList.cursor,
		"workfolio": workfolioList.cursor,
		"jobs": jobList.cursor,
		"problems": problemList.cursor,
		"freelance": freelanceList.cursor,
	};
	
	
	//function handle for choosing the fetch function with corresponding arrgument data
	const fetchData = useCallback(() => {
		const matchedPath = Object.keys(fetchFunctions).find((path) => checkPathMatch(path));

		if (matchedPath) {
			const fetchFunction = fetchFunctions[matchedPath]; // it assign the function from list of fuction 
			

			// Select the correct cursor dynamically
			const cursor = listCursors[matchedPath];

			const params = [
				cursor, // Dynamically choose the correct cursor
				authToken,
				dispatch,
				communityId,				
			];

			 
			fetchFunction(...params);
			 
		}
	}, [
		checkPathMatch, 
		postList.cursor,
		workfolioList.cursor,
		problemList.cursor,
		jobList.cursor,
		freelanceList.cursor,
		dispatch,
		authToken,
		communityId,
	]);

	
	
	// Trigger fetch when the component mounts or route changes 
	useEffect(() => {
		// Cancel token for axios request
		const source = axios.CancelToken.source();

		const dataConditions = [ 
			{ path: "posts", list: postList.postList },
			{ path: "workfolio", list: workfolioList.workfolioList },
			{ path: "jobs", list: jobList.jobList },
			{ path: "problems", list: problemList.problemList },
			{ path: "freelance", list: freelanceList.freelanceList },
		];

		const shouldFetchData = dataConditions.some(({ path, list }) => {
			return checkPathMatch(path) && list.length === 0;
		});
	 
		if (shouldFetchData) {
			fetchData(); 
		}

		return () => {
			source.cancel("Request canceled due to component unmount");
		};
	}, [
		location.pathname, 
		checkPathMatch,  
		postList.postList.length, 
		workfolioList.workfolioList.length, 
		jobList.jobList.length, 
		problemList.problemList.length, 
		freelanceList.freelanceList.length, 
		authToken, 
		communityId,
	]);
		
		
	
	
	
//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
    
        dispatch(updateCommunityDetailState({ type: 'setScrollHeightPosition', scrollHeightPosition: scrollTop }));
    

}, [dispatch,  ]);

 
	
	useEffect(() => {
		// Cancel token for axios request
		const source = axios.CancelToken.source();
   
		if(communityDetail.communityDetail == null )
		{ 
			fetchCommunityDetail( authToken, dispatch, communityId, setDetailLoading )
		}

		return () => {
			source.cancel("Request canceled due to component unmount");
		};
	}, [
	 dispatch,
		authToken, 
		communityId,
		communityDetail.communityDetail,
	]);
	 
	 
	 
	if(detailLoading)
	{
		return(
		<div className="text-center py-4">
							<Spinner animation="border" size="md" />
						</div>
		);
	}
	
	if(communityDeleted)
	{
		return(
		<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<p className="no_posts_message   ">
			Community is deleted. </p>
		</div>
		);
	}
	if(communityDetail.communityDetail == null && !detailLoading)
	{
		return(
		<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<p className="no_posts_message   ">
			Community is not found or deleted. </p>
		</div>
		);
	}
	 
  return (
		<>
			{/*for SEO, change document title and meta data (name and description of meta data)*/}
			<PageSeo 
				title={communityDetail?.communityDetail?.name ? `${communityDetail.communityDetail.name} - Community Detail | SkillVilla` : 'Community Detail | SkillVilla'}
				description={communityDetail.communityDetail?.name ? `Explore the details of the ${communityDetail.communityDetail.name} community on SkillVilla.` : 'Learn more about the communities on SkillVilla.'}
				keywords={communityDetail.communityDetail?.name ? `community detail, ${communityDetail.communityDetail.name}, SkillVilla, explore communities` : 'community detail, SkillVilla, explore, community information'}
			/>

			<InfiniteScrollContainer
				fetchData={fetchData}
				hasMore={hasMore}//hasMore is location state
				loading={detailLoading ? false : loading}
				initialScrollPosition={communityDetail.scrollHeightPosition}  
				onScrollUpdate={handleScrollUpdate}
				style={' pb-5      main_container '}
			>
				<Row className="w-100 m-auto p-0 pt-3 pt-md-5">
					<Col xs={12} sm={12} md={10} lg={10} xl={8}
					className="px-2 px-md-4 px-lg-5 mx-auto  ">
					 
						
						 
						{		communityDetail.communityDetail != null && !detailLoading
								&&
								<>
									{/*community detail section*/}
									<CommunityDetailHeader communityDetail={communityDetail.communityDetail} communityId={communityId} setCommunityDeleted={setCommunityDeleted}  />
									
									
									 
								</>
								
							 
					 }	
						
						
						
					</Col>
					<Col xs={12} sm={12} className="px-0  py-5 mx-auto  " >
					
						{/*community feed section*/}
						{
							!detailLoading && 
							<div className="  px-0   px-sm-3 px-md-4 px-lg-5  ">
								<CommunityDetailFeedType communityId={communityId} />
							</div>
						}	
						 
						
						{/*child page or component for display list of feed like post, workfolio, problem, jobs, freelance*/}
						<div className="pt-3">
							<Outlet />
						</div>
						
						{/* Messages for each type when no data is available */}
						<div className="  px-0   px-sm-3 px-md-4 px-lg-5  ">
							{!loading && checkPathMatch('posts') && postList.postList.length === 0 && <NoContentMessage type="posts" />}
							
							{!loading && checkPathMatch('workfolio') && workfolioList.workfolioList.length === 0 && <NoContentMessage type="workfolio" />}
							
							{!loading && checkPathMatch('jobs') &&  jobList.jobList.length === 0 && <NoContentMessage type="jobs" />}
							
							{!loading &&  checkPathMatch('problems') && problemList.problemList.length === 0 && <NoContentMessage type="problems" />}
							
							{!loading && checkPathMatch('freelance') && freelanceList.freelanceList.length === 0 && <NoContentMessage type="freelance" />}
					
						</div>
					</Col>
				 
				
				</Row>
			
				{/*component for share post with user or community or copy link*/}
				<Share />
			</InfiniteScrollContainer>
    </>
  );
};

export default memo(CommunityDetailPage);
