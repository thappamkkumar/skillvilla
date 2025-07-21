 
import   {useEffect, useState, useCallback, useRef }  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
 

import ProblemList from '../../../Components/Customer/ProblemList/ProblemList';
import ProblemHeader from '../../../Components/Customer/ProblemList/ProblemHeader'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 
 import {updateProblemState as updateMyProblemState} from '../../../StoreWrapper/Slice/MyProblemSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 
 

import useProblemSolutionCountWebsocket from '../../../Websockets/Problem/useProblemSolutionCountWebsocket'; 




const MyProblemPage = () => { 
	 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const problemList = useSelector((state) => state.myProblemList); //selecting post List from store
	//replace with project state
	const [loading, setLoading] = useState(false);
	  
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
	/// Call the useProblemWebsockets hook for websockets event listeners
	useProblemSolutionCountWebsocket(logedUserData);
	
		
		
	 
 
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			 
			setLoading(true);
			let userData = {userId:null }
			let url = `/get-user-problems?cursor=${problemList.cursor}`;
			  
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			 //console.log(data);
			if(data != null && data.status == true )
			{
				if(data.problemList.data.length != 0 )
				 {
					dispatch(updateMyProblemState({type : 'SetProblem', problemList: data.problemList.data}));  
				 } 
				dispatch(updateMyProblemState({type : 'SetCursor', cursor: data.problemList.next_cursor})); 
				dispatch(updateMyProblemState({type : 'SetHasMore', hasMore: data.problemList.next_cursor != null})); 
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
		  dispatch(updateMyProblemState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
	return ( 
		<>
			<PageSeo 
				title="My Problems | SkillVilla"
				description="View and manage the problems you've posted or are working on in SkillVilla."
				keywords="my problems, user problems, SkillVilla, problem management"
			/>

			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={problemList.hasMore}
				loading={loading}
				initialScrollPosition={problemList.scrollHeightPosition}
				 onScrollUpdate={handleScrollUpdate}
			>
				<ProblemHeader  heading="My Problems" myProblem={true}/>
				{
				 (problemList.problemList.length <= 0 && !loading) 
				 ?
				 (
					<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
						<p className="no_posts_message  ">
						You haven't posted any problem yet. Start by posting your first problem!
						</p>
					</div>
				 ):(
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

export default MyProblemPage;
