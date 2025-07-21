 
import   {useEffect, useState, useCallback  }  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
  
import FreelanceList from '../../../Components/Customer/FreelanceList/FreelanceList';
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
  
import {updateFreelanceState as updateAppliedSavedFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 

import useFreelanceDeleteWebsocket from '../../../Websockets/Freelance/useFreelanceDeleteWebsocket'; 

 



const AppliedFreelancePage = () => { 
	 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const freelanceList = useSelector((state) => state.appliedSavedFreelanceList); //selecting freelance List from store
	 
	const [loading, setLoading] = useState(false);
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	 // Call the   hook for websockets event listeners
	useFreelanceDeleteWebsocket(logedUserData);
		   
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			 
			setLoading(true);
			let userData = {userId:null };
			let url = `/get-applied-freelance-work?cursor=${freelanceList.cursor}`;
			  
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			//console.log(data);
			if(data != null && data.status == true )
			{
				if(data.freelanceList.data.length != 0 )
				 {
					dispatch(updateAppliedSavedFreelanceState({type : 'SetFreelance', freelanceList: data.freelanceList.data}));
					} 
					dispatch(updateAppliedSavedFreelanceState({type : 'SetCursor', cursor: data.freelanceList.next_cursor})); 
					dispatch(updateAppliedSavedFreelanceState({type : 'SetHasMore', hasMore: data.freelanceList.next_cursor != null})); 
				  
			}
			 setLoading(false);
		}
		catch(error)
		{
			 //console.log(error);
			setLoading(false);
		}
			
	},[dispatch, freelanceList, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(freelanceList.freelanceList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [freelanceList.freelanceList, authToken]);
	
	 
       
 	 
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateAppliedSavedFreelanceState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
				title="Applied Freelance Gigs | SkillVilla"
				description="Track the freelance gigs you’ve applied to on SkillVilla."
				keywords="applied gigs, freelance applications, SkillVilla"
			/>

			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={freelanceList.hasMore}
				loading={loading}
				initialScrollPosition={freelanceList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			>
			 <div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
				<h3 className="fw-bold  ">Applied Freelance Gigs</h3>
			 </div>
							
				{
					(freelanceList.freelanceList.length <= 0 && !loading) ?
					(
						<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<p className="no_posts_message  ">You haven't applied or placed bid for  any freelance work or task yet.</p>
						</div>
					):(
						<>
							 
							<FreelanceList freelanceList={freelanceList.freelanceList} />
				 
						</>
					)
				}
				{/*component for share post with user or community or copy link*/}
				<Share /> 
			</InfiniteScrollContainer>
		</>
	);
};

export default AppliedFreelancePage;
