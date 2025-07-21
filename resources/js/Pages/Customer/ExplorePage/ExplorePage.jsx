 
import {useEffect, useState, useCallback, useRef, memo }  from 'react';  
import { Outlet, useLocation  } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux";

import ExploreSearchBox from '../../../Components/Customer/ExploreSearch/ExploreSearchBox'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import ExploreJobFilters from '../../../Components/Customer/ExploreJob/ExploreJobFilters'; 
import NoSearchResultsMessage from '../../../Components/Customer/ExploreMessage/NoSearchResultsMessage'; 
import NoInterestResultsMessage from '../../../Components/Customer/ExploreMessage/NoInterestResultsMessage'; 
import Share from '../../../Components/Customer/Share/Share'; 

import { updatePostState } from '../../../StoreWrapper/Slice/PostSlice';
import {updateWorkfolioState} from '../../../StoreWrapper/Slice/WorkfolioSlice'; 
import {updateProblemState} from '../../../StoreWrapper/Slice/ProblemSlice';
import {updateJobState} from '../../../StoreWrapper/Slice/JobSlice';
import {updateFreelanceState} from '../../../StoreWrapper/Slice/FreelanceSlice';
import {updateUserState} from '../../../StoreWrapper/Slice/UserSlice';
import {updateCommunityState} from '../../../StoreWrapper/Slice/SuggestionCommunitySlice';
 
   
import fetchUserForExplore from './FetchData/fetchUserForExplore';  
import fetchPostForExplore from './FetchData/fetchPostForExplore';  
import fetchWorkfolioForExplore from './FetchData/fetchWorkfolioForExplore';  
import fetchProblemForExplore from './FetchData/fetchProblemForExplore';  
import fetchJobForExplore from './FetchData/fetchJobForExplore';  
import fetchFreelanceForExplore from './FetchData/fetchFreelanceForExplore';  
import fetchCommunitiesForExplore from './FetchData/fetchCommunitiesForExplore';  
 


const ExplorePage = () => { 
	const location = useLocation();
  const dispatch = useDispatch();
 	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	
	//redux states 
	const communityList = useSelector((state) => state.suggestionCommunityList); //selecting chat List from store
	const userList = useSelector((state) => state.userList); //selecting user List from store
	const postList = useSelector((state) => state.postList); //selecting post List from store
	const workfolioList = useSelector((state) => state.workfolioList); //selecting post List from store
	const problemList = useSelector((state) => state.problemList); //selecting post List from store
	const jobList = useSelector((state) => state.jobList); //selecting post List from store
	const freelanceList = useSelector((state) => state.freelanceList); //selecting freelance List from store
	const jobFilter = useSelector((state) => state.exploreJobFilters.filters); 
	const jobLocations = useSelector((state) => state.exploreJobFilters.jobLocations); 
	const searchInput = useSelector((state) => state.exploreSearch.searchInput); // Selecting searchInput 
	const searching = useSelector((state) => state.exploreSearch.searching); // Selecting searchInput 
	
	// Local state 
  const [loading, setLoading] = useState(false);
  const [scrollHeightPosition, setScrollHeightPosition] = useState(0);
  const [hasMore, setHasMore] = useState(false);
 
	 

	//determine the path and return true or false
	const checkPathMatch = useCallback((path) => {
		if (location.pathname.includes(path))
		{
			return true;
		}
		return false;
	}, [location.pathname]);

	//get list according to route path and set hasmore and scrollHeightPosition to local state
	useEffect(() => {
			const listMap = {
					"explore/users": userList,
					"explore/posts": postList,
					"explore/workfolio": workfolioList,
					"explore/jobs": jobList,
					"explore/problems": problemList,
					"explore/freelance": freelanceList,
					"explore/communities": communityList,
			};

			// Get the appropriate list based on the current pathname
			const currentList = Object.keys(listMap).find(path => checkPathMatch(path));

			if (currentList) {
					const list = listMap[currentList];
					setScrollHeightPosition(list.scrollHeightPosition);
					setHasMore(list.hasMore);
			}

	}, [
			location.pathname,
			checkPathMatch,
			userList,
			postList,
			workfolioList,
			jobList,
			problemList,
			freelanceList,
			communityList,
	]);


   


	 


  // Define the fetch function mappings
	 const fetchFunctions = {
		"explore/users": (cursor, authToken, dispatch, searchInput) => fetchUserForExplore(setLoading, cursor, authToken, dispatch, searchInput),
		"explore/posts": (cursor, authToken, dispatch, searchInput) => fetchPostForExplore(setLoading, cursor, authToken, dispatch, searchInput),
		"explore/workfolio": (cursor, authToken, dispatch, searchInput) => fetchWorkfolioForExplore(setLoading, cursor, authToken, dispatch, searchInput),
		"explore/jobs": (cursor, authToken, dispatch, searchInput, jobFilter, jobLocations) => {
			const isJobLocationsEmpty = jobLocations.length === 0;
			return fetchJobForExplore(setLoading, cursor, authToken, dispatch, searchInput, jobFilter, isJobLocationsEmpty);
		},
		"explore/problems": (cursor, authToken, dispatch, searchInput) => fetchProblemForExplore(setLoading, cursor, authToken, dispatch, searchInput),
		"explore/freelance": (cursor, authToken, dispatch, searchInput) => fetchFreelanceForExplore(setLoading, cursor, authToken, dispatch, searchInput),
		"explore/communities": (cursor, authToken, dispatch, searchInput) => fetchCommunitiesForExplore(setLoading, cursor, authToken, dispatch, searchInput),
	};

	// Define a map for which path corresponds to which list's cursor
	const listCursors = {
		"explore/users": userList.cursor,
		"explore/posts": postList.cursor,
		"explore/workfolio": workfolioList.cursor,
		"explore/jobs": jobList.cursor,
		"explore/problems": problemList.cursor,
		"explore/freelance": freelanceList.cursor,
		"explore/communities": communityList.cursor,
	};

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
				searchInput,
			];

			// Special case for 'explore/jobs' since it needs extra parameters
			if (matchedPath === "explore/jobs") {
				fetchFunction(...params, jobFilter, jobLocations);
			} else {
				fetchFunction(...params);
			}
		}
	}, [
		checkPathMatch,
		userList.cursor,
		postList.cursor,
		workfolioList.cursor,
		problemList.cursor,
		jobList.cursor,
		freelanceList.cursor,
		communityList.cursor,
		dispatch,
		authToken,
		jobFilter,
		jobLocations,
		searchInput,
	]);


 // Trigger fetch when the component mounts or route changes 
useEffect(() => {
  // Cancel token for axios request
  const source = axios.CancelToken.source();

  const dataConditions = [
    { path: "explore/users", list: userList.userList },
    { path: "explore/posts", list: postList.postList },
    { path: "explore/workfolio", list: workfolioList.workfolioList },
    { path: "explore/jobs", list: jobList.jobList },
    { path: "explore/problems", list: problemList.problemList },
    { path: "explore/freelance", list: freelanceList.freelanceList },
    { path: "explore/communities", list: communityList.communityList },
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
  userList.userList.length, 
  postList.postList.length, 
  workfolioList.workfolioList.length, 
  jobList.jobList, 
  problemList.problemList.length, 
  freelanceList.freelanceList.length, 
  communityList.communityList.length, 
  authToken, 
]);









//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
    const pathMap = {
        "explore/users": updateUserState,
        "explore/posts": updatePostState,
        "explore/workfolio": updateWorkfolioState,
        "explore/jobs": updateJobState,
        "explore/problems": updateProblemState,
        "explore/freelance": updateFreelanceState,
        "explore/communities": updateCommunityState,
    };

    const matchedPath = Object.keys(pathMap).find(path => checkPathMatch(path));

    if (matchedPath) {
        const updateState = pathMap[matchedPath];
        dispatch(updateState({ type: 'setScrollHeightPosition', scrollHeightPosition: scrollTop }));
    }

}, [dispatch, checkPathMatch]);

	
   
 	 
	 

  
 
 
	return ( 
	 <InfiniteScrollContainer
      fetchData={fetchData}
      hasMore={hasMore}//hasMore is location state
      loading={loading}
      initialScrollPosition={scrollHeightPosition}//scrollHeightPosition is location state
      onScrollUpdate={handleScrollUpdate}
			style={' pb-5     main_container '}
    >
			<div>
				<ExploreSearchBox  />
			</div>
			
			
			{/*add job filter if job section is selected*/}
			{  checkPathMatch("explore/jobs")  &&     <ExploreJobFilters  />   	} 
			
			 
			
			
			{/*container for child component of explore*/}
			<div className="pt-3">
			 
				{/*Message if not user related user interest  */}
				{checkPathMatch("explore/users") && userList.userList.length  === 0 && !loading && !searching && <NoInterestResultsMessage section="User" />}
				
				{/*Message if not post related user interest  */}
				{checkPathMatch("explore/posts") && postList.postList.length  === 0 && !loading && !searching && <NoInterestResultsMessage section="Post" />}
				
				{/*Message if not workfolio related user interest  */}
				{checkPathMatch("explore/workfolio") && workfolioList.workfolioList.length  === 0 && !loading && !searching && <NoInterestResultsMessage section="Workfolio" />}
				 
				{/*Message if not jobs related user interest  */}
				{checkPathMatch("explore/jobs") && jobList.jobList.length  === 0 && !loading && !searching && <NoInterestResultsMessage section="Job" />}
				 
				  
				{/*Message if not problems related user interest  */}
				{checkPathMatch("explore/problems") && problemList.problemList.length  === 0 && !loading && !searching && <NoInterestResultsMessage section="Problem" />}
				
				{/*Message if not freelance related user interest  */}
				{checkPathMatch("explore/freelance") && freelanceList.freelanceList.length  === 0 && !loading && !searching && <NoInterestResultsMessage section="Freelance" />}
				 
				{/*Message if not communities related user interest  */}
				{checkPathMatch("explore/communities") && communityList.communityList.length  === 0 && !loading && !searching && <NoInterestResultsMessage section="Communities" />}
				 
				
			 
				 
				  
				{/* Message if searching and no data found */}
				{
					searching && !loading && (
						(checkPathMatch("explore/users") && userList.userList.length === 0) ||
						(checkPathMatch("explore/posts") && postList.postList.length === 0) ||
						(checkPathMatch("explore/workfolio") && workfolioList.workfolioList.length === 0) ||
						(checkPathMatch("explore/jobs") && jobList.jobList.length === 0) ||
						(checkPathMatch("explore/problems") && problemList.problemList.length === 0) ||
						(checkPathMatch("explore/freelance") && freelanceList.freelanceList.length === 0)||
						(checkPathMatch("explore/communities") && communityList.communityList.length === 0)
					) && (
						 
							<NoSearchResultsMessage  />
					)
				}

				
				
				<Outlet />
			</div>
			
			{/*component for share post with user or community or copy link*/}
			<Share />
			
			
	 </InfiniteScrollContainer>
	);
};

export default memo(ExplorePage);
