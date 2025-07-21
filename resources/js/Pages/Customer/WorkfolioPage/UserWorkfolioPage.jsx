 
import   {useEffect, useState, useCallback}  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
import {  useParams } from 'react-router-dom';   

import WorkfolioList from '../../../Components/Customer/WorkfolioList/WorkfolioList'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import {updateWorkfolioState as updateUserWorkfolioState } from '../../../StoreWrapper/Slice/UserWorkfolioSlice';
 
  
import serverConnection from '../../../CustomHook/serverConnection';  
 
import useAddNewWorkfolioWebsocket from '../../../Websockets/Workfolio/useAddNewWorkfolioWebsocket'; 
import useWorkfolioAvgCountWebsocket from '../../../Websockets/Workfolio/useWorkfolioAvgCountWebsocket'; 
import useWorkfolioDeleteWebsocket from '../../../Websockets/Workfolio/useWorkfolioDeleteWebsocket'; 




const UserWorkfolioPage = () => { 

	const { userId, ID } = useParams(); // get id from URL parameter
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const workfolioList = useSelector((state) => state.userWorkfolioList); //selecting post List from store
	//replace with project state
	const [loading, setLoading] = useState(false);
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
	/// Call the  hook for websockets event listeners
	useAddNewWorkfolioWebsocket(ID);
	useWorkfolioAvgCountWebsocket(logedUserData);
	useWorkfolioDeleteWebsocket(logedUserData);
	
 
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			let userData = {userId: null, } ;
			let url = `/get-user-workfolio?cursor=${workfolioList.cursor}`;
			if(ID != null)
			{
				  userData = {userId: ID, }
			}
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			//update the post state in redux.
			//console.log(data);

			 if(data.status == true )
			 {
				 if(data.workList.data.length != 0 )
				 { 
					dispatch(updateUserWorkfolioState({type : 'SetWorkfolio', workfolioList: data.workList.data}));  
				 }
					dispatch(updateUserWorkfolioState({type : 'SetCursor', cursor: data.workList.next_cursor})); 
					dispatch(updateUserWorkfolioState({type : 'SetHasMore', hasMore: data.workList.next_cursor != null})); 
				  
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
		  dispatch(updateUserWorkfolioState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
	 
  
	 
	 
	return ( 
		<>
				<PageSeo
					title={workfolioList?.workfolioList?.[0]?.user?.name ? `${workfolioList?.workfolioList?.[0]?.user?.name}'s Workfolios | SkillVilla` : 'User Workfolios | SkillVilla'}
					description={workfolioList?.workfolioList?.[0]?.user?.name ? `Browse workfolios shared by ${workfolioList?.workfolioList?.[0]?.user?.name} on SkillVilla.` : 'Explore workfolios shared by professionals on SkillVilla.'}
					keywords={workfolioList?.workfolioList?.[0]?.user?.name ? `workfolio, ${workfolioList?.workfolioList?.[0]?.user?.name}, user workfolio, SkillVilla` : 'workfolio, SkillVilla, user workfolios'}
				/>
		
				<InfiniteScrollContainer
					fetchData={apiCall}
					hasMore={workfolioList.hasMore}
					loading={loading}
					initialScrollPosition={workfolioList.scrollHeightPosition}
					 onScrollUpdate={handleScrollUpdate}
				>
					<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
						<h3 className="fw-bold  ">Updated Workfolio</h3>
					</div>
					{
					 (workfolioList.workfolioList.length <= 0 && !loading) ?
					 (
						 <div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
								<p className="no_posts_message  "> This user hasn't posted any work yet. </p>
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

export default UserWorkfolioPage;
