 
import   {useEffect, useState, useCallback }  from 'react';  
import {useDispatch, useSelector } from 'react-redux';  
 
 
import WorkfolioList from '../../../Components/Customer/WorkfolioList/WorkfolioList';
import WorkfolioHeader from '../../../Components/Customer/WorkfolioList/WorkfolioHeader';
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import {updateWorkfolioState as updateSavedWorkfolioState} from '../../../StoreWrapper/Slice/SavedWorkfolioSlice'; 
 
import serverConnection from '../../../CustomHook/serverConnection';  

import useWorkfolioAvgCountWebsocket from '../../../Websockets/Workfolio/useWorkfolioAvgCountWebsocket'; 
import useWorkfolioDeleteWebsocket from '../../../Websockets/Workfolio/useWorkfolioDeleteWebsocket'; 
 


const SavedWorkfolioPage = () => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const workfolioList = useSelector((state) => state.savedWorkfolioList); //selecting   List from store
	 
	const [loading, setLoading] = useState(false); 
	
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
	/// Call the  hook for websockets event listeners
  	useWorkfolioAvgCountWebsocket(logedUserData);
		useWorkfolioDeleteWebsocket(logedUserData);
	 
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			let userData = {  }
			let url = `/get-saved-workfolio?cursor=${workfolioList.cursor}`;
			 
			//call the function fetcg post data fron server
			let data = await serverConnection(url,userData, authToken);
			//update the post state in redux.
			 // console.log(data);
			if(data.status == true )
			{
				 if(data.workList.data.length != 0 )
				 {
					dispatch(updateSavedWorkfolioState({type : 'SetWorkfolio', workfolioList: data.workList.data}));  
				 }
					dispatch(updateSavedWorkfolioState({type : 'SetCursor', cursor: data.workList.next_cursor})); 
					dispatch(updateSavedWorkfolioState({type : 'SetHasMore', hasMore: data.workList.next_cursor != null})); 
				 
			}			 
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
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
		  dispatch(updateSavedWorkfolioState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
 
	return ( 
		<>
			<PageSeo 
				title="Saved Workfolios | SkillVilla"
				description="Access and view your saved workfolios on SkillVilla."
				keywords="saved workfolios, bookmarks, SkillVilla, user saved content"
			/>

			<InfiniteScrollContainer
					fetchData={apiCall}
					hasMore={workfolioList.hasMore}
					loading={loading}
					initialScrollPosition={workfolioList.scrollHeightPosition}
					 onScrollUpdate={handleScrollUpdate}
			> 
				 
				<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
					<h3 className="fw-bold  ">Saved Works</h3>
				</div> 
					
				{
					 (workfolioList.workfolioList.length <= 0 && !loading) ?
					 (
							<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
								<p className="no_posts_message  ">
									No saved work yet. Save some interesting works!
								</p>
							</div>
							
					 ):(
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

export default SavedWorkfolioPage;
