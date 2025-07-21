 
import   {useEffect, useState, useCallback, useRef }  from 'react';  
import {useDispatch, useSelector } from 'react-redux';  
  
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer';
import WorkfolioHeader from '../../../Components/Customer/WorkfolioList/WorkfolioHeader'; 
import WorkfolioList from '../../../Components/Customer/WorkfolioList/WorkfolioList';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import {updateWorkfolioState as updateMyWorkfolioState} from '../../../StoreWrapper/Slice/MyWorkfolioSlice';
 
  
import serverConnection from '../../../CustomHook/serverConnection';  

import useWorkfolioAvgCountWebsocket from '../../../Websockets/Workfolio/useWorkfolioAvgCountWebsocket'; 
 



const MyWorkfolioPage = () => {  

	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const workfolioList = useSelector((state) => state.myWorkfolioList); //selecting post List from store
	//replace with project state
	const [loading, setLoading] = useState(false);
	const scrollRef = useRef(null);
 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
	/// Call the   hook for websockets event listeners
	useWorkfolioAvgCountWebsocket(logedUserData);
	
	
	 
 
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			let userData = { userId: null};
			let url = `/get-user-workfolio?cursor=${workfolioList.cursor}`;
			 
		 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			//update the post state in redux.
			//console.log(data);

			 if(data.status == true )
			 {
				 if(data.workList.data.length != 0 )
				 { 
					dispatch(updateMyWorkfolioState({type : 'SetWorkfolio', workfolioList: data.workList.data}));  
				 }
					dispatch(updateMyWorkfolioState({type : 'SetCursor', cursor: data.workList.next_cursor})); 
					dispatch(updateMyWorkfolioState({type : 'SetHasMore', hasMore: data.workList.next_cursor != null})); 
				  
			 }
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
			
	},[dispatch, workfolioList, authToken]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(workfolioList.workfolioList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [workfolioList.workfolioList, authToken]);
	
	
	
  
	 
 	 //function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateAppliedSavedFreelanceState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	 
	
	
	return ( 
		<>
			<PageSeo 
				title="My Workfolios | SkillVilla"
				description="View and manage your workfolios on SkillVilla."
				keywords="my workfolios, user workfolios, SkillVilla, workfolio management"
			/>

			<InfiniteScrollContainer
					fetchData={apiCall}
					hasMore={workfolioList.hasMore}
					loading={loading}
					initialScrollPosition={workfolioList.scrollHeightPosition}
					 onScrollUpdate={handleScrollUpdate}
				>
				
					<WorkfolioHeader heading="My Works" myWork={true} /> 
					
					{
					 (workfolioList.workfolioList.length <= 0 && !loading) ?
					 (
						 <div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
									<p className="no_posts_message  ">
									You haven't posted any work yet. Start by creating your first task!
								</p>
							</div>
					 )
					 :
					 (
							<>
								
								<WorkfolioList workfolioList={workfolioList.workfolioList} /> 
							</>
							 
					 )
				 } 
					
				 
				{/*component for share post with user or community or copy link*/}
					<Share /> 
				
				 
			</InfiniteScrollContainer>
		</>
		
	);
};

export default MyWorkfolioPage;
