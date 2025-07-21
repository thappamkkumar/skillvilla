 
import   {useEffect, useState, useCallback, useRef }  from 'react';  
import {useDispatch, useSelector } from 'react-redux';  
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col'; 
import Spinner from 'react-bootstrap/Spinner'; 

import StoriesList from '../../../Components/Customer/StoriesList/StoriesList';
import LoggedUserStory from '../../../Components/Customer/StoriesList/LoggedUserStory';
import StoriesHeader from './Stories/StoriesHeader'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
 
 
import {updateStoriesState} from '../../../StoreWrapper/Slice/StoriesSlice';
import {updateStoriesState as updateUserStoriesState} from '../../../StoreWrapper/Slice/UserStoriesSlice';

import serverConnection from '../../../CustomHook/serverConnection'; 

import useStoriesWebsockets from './Stories/useStoriesWebsockets';



const StoriesPage = () => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const storiesList = useSelector((state) => state.storiesList);  
	const userStoriesList = useSelector((state) => state.userStoriesList);  
	 
	const [loggedUserStoryLoading, setLoggedUserStoryLoading] = useState(false);
	const [loading, setLoading] = useState(false); 
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	// Call the useStoriesWebsockets hook for websockets event listeners 
	 useStoriesWebsockets();
	
	//console.log(storiesList.storiesList);
	//console.log(userStoriesList.storiesList);
	
	  
	
	
	const apiCallForLoggedUserStory = useCallback(async()=>{ 
		try
		{
			setLoggedUserStoryLoading(true);
			let userData = {  };
			let url = `/get-logged-user-stories`
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			 // console.log(data);
			 if(data != null && data.status == true )
			{
				if(data.story)
				 {
					// Wrap the story object in an array if it's not already an array
            dispatch(updateStoriesState({ type: 'SetLoggedUserStories', storiesList: data.story }));
         }
				dispatch(updateStoriesState({type : 'SetLoggedUserCanAddStory', canAddStory: data.canAddStory})); 
				dispatch(updateStoriesState({type : 'SetCursor', cursor: null})); 
				dispatch(updateStoriesState({type : 'SetHasMore', hasMore: false})); 
			} 
			 setLoggedUserStoryLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoggedUserStoryLoading(false);
		}
			
	},[dispatch, userStoriesList, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(storiesList.storiesList.length == 0)
		{ 
			apiCallForLoggedUserStory(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [storiesList.storiesList, authToken]);
	
	
	//function for fetching data or stories of following user 
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			let userData = {  };
			let url = `/get-user-has-stories?cursor=${userStoriesList.cursor}`;
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			  //console.log(data);

			if(data != null && data.status == true )
			{
				if(data.storiesList.data.length != 0 )
				 {
					dispatch(updateUserStoriesState({type : 'SetFollowingUserStories', storiesList: data.storiesList.data}));   
				 } 
				dispatch(updateUserStoriesState({type : 'SetCursor', cursor: data.storiesList.next_cursor})); 
				dispatch(updateUserStoriesState({type : 'SetHasMore', hasMore: data.storiesList.next_cursor != null})); 
			}
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
			
	},[dispatch, userStoriesList, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(userStoriesList.storiesList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [userStoriesList.storiesList, authToken]);
	
	
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateUserStoriesState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop})); 
    
  }, [dispatch]); 
	 
	 	 
	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
					title="Stories | SkillVilla"
					description="Browse inspiring stories shared by professionals on SkillVilla."
					keywords="stories, SkillVilla, user stories, experiences, professional journeys"
			/>

			<Row className="p-0 m-0 h-100">
				<Col  sx={12} sm={12} md={5}   xl={4} className="p-0 m-0 h-100   customListGroupContainer"   style={{borderRight:'0.1rem  solid rgba(51,51,51, 0.2) '}}> 
					<InfiniteScrollContainer
						fetchData={apiCall}
						hasMore={userStoriesList.hasMore}
						loading={loading}
						initialScrollPosition={userStoriesList.scrollHeightPosition}
						onScrollUpdate={handleScrollUpdate}
						style = "  px-0 pt-2 pb-5   overflow-auto w-100 h-100  " 
						 
					> 
						<StoriesHeader  canAddStory={storiesList.canAddStory}/> 
						{
							loggedUserStoryLoading ?
							(
								<div className="text-center py-4">
									<Spinner animation="border" size="md" />
								</div>
							):(
								
								<LoggedUserStory storiesList={storiesList.storiesList}  /> 
							)
						}
						
						
						<h4 className="m-0 px-2 py-2 " style={{'backgroundColor':'rgba(0, 128, 128,0.4)'}}>Updated Stories</h4>
							{
								(userStoriesList.storiesList.length <= 0 && !loading)
								&&
								(
									<p className="no_posts_message post my-4">You haven't followed any users yet, or they haven't posted any stories.</p>
								)
							}
							{
								(userStoriesList.storiesList.length > 0 && !loading)
								&&
								(
									<StoriesList storiesList={userStoriesList.storiesList}  />
								)
							}
					</InfiniteScrollContainer>
				 
				</Col>
			 
					<Col sx={0} sm={0} md={7} xl={8} className="d-none d-md-block p-0  ">
					 
						<div className="w-100 h-100 d-flex justify-content-center align-items-center">
							<h5 className="text-center  text-muted">Click on user to view thier stories.</h5>
						</div>
					 
					</Col> 
			
			</Row>
		</>
	);
};

export default StoriesPage;
