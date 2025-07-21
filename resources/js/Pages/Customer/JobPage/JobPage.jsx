 
import   {useEffect, useState, useCallback  }  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
      
import JobList from '../../../Components/Customer/CompanyJobList/JobList';
import JobHeader from '../../../Components/Customer/CompanyJobList/JobHeader'; 
import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import {updateJobState} from '../../../StoreWrapper/Slice/JobSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 

import useJobDeleteWebsocket from '../../../Websockets/Job/useJobDeleteWebsocket'; 



 



const JobPage = () => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const jobList = useSelector((state) => state.jobList); //selecting post List from store
	 
	const [loading, setLoading] = useState(false);
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	 // Call the   hook for websockets event listeners 
	useJobDeleteWebsocket( logedUserData );
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			let userData = { }
			let url = `/get-interested-job-vacancies?cursor=${jobList.cursor}`;
			  
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			 // console.log(data);
			if(data != null && data.status == true )
			{
				if(data.jobList.data.length != 0 )
				 {
					dispatch(updateJobState({type : 'SetJob', jobList: data.jobList.data}));
					} 
					dispatch(updateJobState({type : 'SetCursor', cursor: data.jobList.next_cursor})); 
					dispatch(updateJobState({type : 'SetHasMore', hasMore: data.jobList.next_cursor != null})); 
				  
			}
			 setLoading(false);
		}
		catch(error)
		{
			 //console.log(error);
			setLoading(false);
		}
			
	},[dispatch, jobList, authToken]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(jobList.jobList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [jobList.jobList, authToken]);
	
	 
       
 	 
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateJobState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
				title="Jobs | SkillVilla"
				description="Discover job opportunities from professionals you follow or match your interests on SkillVilla."
				keywords="jobs, SkillVilla, interested jobs, followed users, career opportunities"
			/>

			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={jobList.hasMore}
				loading={loading}
				initialScrollPosition={jobList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			>
				<JobHeader heading="Jobs"/>
				{
					 (jobList.jobList.length <= 0 && !loading) ?
					 (
							<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
								<p className="no_posts_message  ">
								You haven't followed any users yet, or they haven't posted any job.</p>
							</div>
					 ):(
							<>
								
								<JobList jobList={jobList.jobList} /> 
							</>
					 )
				}
				 
				{/*component for share post with user or community or copy link*/}
				<Share />
					
			</InfiniteScrollContainer>
		</>
	);
};

export default JobPage;
