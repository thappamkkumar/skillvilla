 
import   {useEffect, useState, useCallback, useRef }  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
import {  useParams} from 'react-router-dom'; 
 

import ProblemList from '../../../Components/Customer/ProblemList/ProblemList'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 
import {updateProblemState as updateUserProblemState} from '../../../StoreWrapper/Slice/UserProblemSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 
 
import useAddNewProblemWebsocket from '../../../Websockets/Problem/useAddNewProblemWebsocket'; 
import useProblemDeleteWebsocket from '../../../Websockets/Problem/useProblemDeleteWebsocket'; 
import useProblemSolutionCountWebsocket from '../../../Websockets/Problem/useProblemSolutionCountWebsocket'; 




const UserProblemPage = () => { 
	const { userId, ID } = useParams(); // get id from URL parameter
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const problemList = useSelector((state) => state.userProblemList); //selecting post List from store
	//replace with project state
	const [loading, setLoading] = useState(false);
	  
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	/// Call the  hook for websockets event listeners
	useAddNewProblemWebsocket(ID);
	useProblemDeleteWebsocket(logedUserData);
	useProblemSolutionCountWebsocket(logedUserData);
	
	 
	 
		
		
		
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			if(ID == null)
			{
				return;
			}
			setLoading(true);
			let userData = {userId:ID };
			let url = `/get-user-problems?cursor=${problemList.cursor}`;
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			//console.log(data);
			if(data != null && data.status == true )
			{
				if(data.problemList.data.length != 0 )
				 {
					dispatch(updateUserProblemState({type : 'SetProblem', problemList: data.problemList.data}));  
				 } 
				dispatch(updateUserProblemState({type : 'SetCursor', cursor: data.problemList.next_cursor})); 
				dispatch(updateUserProblemState({type : 'SetHasMore', hasMore: data.problemList.next_cursor != null})); 
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
		  dispatch(updateUserProblemState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
 
	return ( 
		<>
			<PageSeo
				title={problemList?.problemList[0]?.user?.name ? `${problemList?.problemList[0]?.user?.name}'s Problems | SkillVilla` : 'User Problems | SkillVilla'}
				
				description={problemList?.problemList[0]?.user?.name ? `Browse problems posted by ${problemList?.problemList[0]?.user?.name} on SkillVilla.` : 'Explore problems posted by professionals on SkillVilla.'}
				
				keywords={problemList?.problemList[0]?.user?.name ? `problems, ${problemList?.problemList[0]?.user?.name}, user problems, SkillVilla` : 'user problems, SkillVilla, shared problems'}
			/>
			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={problemList.hasMore}
				loading={loading}
				initialScrollPosition={problemList.scrollHeightPosition}
				 onScrollUpdate={handleScrollUpdate}
			>
				<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
					<h2>Recent Problems</h2>
				</div>
							
							
				{
				 (problemList.problemList.length <= 0 && !loading) ?
				 (
					 <div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<p className="no_posts_message  ">This user hasn't posted any problem yet.</p>
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

export default UserProblemPage;
