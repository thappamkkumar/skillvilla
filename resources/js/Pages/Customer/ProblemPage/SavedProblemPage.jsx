 
import   {useEffect, useState, useCallback  }  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
      

import ProblemList from '../../../Components/Customer/ProblemList/ProblemList';
import ProblemHeader from '../../../Components/Customer/ProblemList/ProblemHeader'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 
import {updateProblemState as updateSavedProblemState} from '../../../StoreWrapper/Slice/SavedProblemSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 

import useProblemSolutionCountWebsocket from '../../../Websockets/Problem/useProblemSolutionCountWebsocket'; 
import useProblemDeleteWebsocket from '../../../Websockets/Problem/useProblemDeleteWebsocket'; 



const SavedProblemPage = () => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const problemList = useSelector((state) => state.savedProblemList); //selecting post List from store
	 
	const [loading, setLoading] = useState(false);
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	// Call the   hook for websockets event listeners
	useProblemSolutionCountWebsocket(logedUserData);
	useProblemDeleteWebsocket(logedUserData);
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			let userData = {  }
			let url = `/get-saved-problems?cursor=${problemList.cursor}`;
			  
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			//console.log(data);
			if(data != null && data.status == true )
			{
				if(data.problemList.data.length != 0 )
				 {
					dispatch(updateSavedProblemState({type : 'SetProblem', problemList: data.problemList.data}));
					} 
					dispatch(updateSavedProblemState({type : 'SetCursor', cursor: data.problemList.next_cursor})); 
					dispatch(updateSavedProblemState({type : 'SetHasMore', hasMore: data.problemList.next_cursor != null})); 
				  
			}
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
			
	},[dispatch, problemList, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(problemList.problemList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [problemList.problemList, authToken]);
	
	 
       
 	 
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateSavedProblemState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
				title="Saved Problems | SkillVilla"
				description="Access and view the problems you've saved or bookmarked on SkillVilla."
				keywords="saved problems, bookmarks, SkillVilla, user saved problems"
			/>

			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={problemList.hasMore}
				loading={loading}
				initialScrollPosition={problemList.scrollHeightPosition}
				 onScrollUpdate={handleScrollUpdate}
			>
		
				 <div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
						<h3 className="fw-bold  ">Saved Problems</h3>
					</div>
			 
				{
				 (problemList.problemList.length <= 0 && !loading) ?
				 (
						<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<p className="no_posts_message  ">No saved problem yet. Save some interesting problems!</p>
						</div>
				 )
				 :
				 (
						<>
							
							<ProblemList problemList={problemList.problemList} />
						</>
				 )
			 } 
			 
				{/*component for share post with user or community or copy link*/}
				<Share /> 
			 
			 
			</InfiniteScrollContainer>
		</>
	);
};

export default SavedProblemPage;
