 
import   {useEffect, useState, useCallback  }  from 'react';  
import {useDispatch, useSelector } from 'react-redux'; 
      

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer';
import JobHeader from '../../../Components/Customer/CompanyJobList/JobHeader'; 
import JobList from '../../../Components/Customer/CompanyJobList/JobList';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import {updateJobState as updateMyJobState} from '../../../StoreWrapper/Slice/MyJobSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 

import useJobApplicationCountWebsocket from '../../../Websockets/Job/useJobApplicationCountWebsocket'; 




const MyJobPage = () => { 
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const jobList = useSelector((state) => state.myJobList); //selecting post List from store
	 
	const [loading, setLoading] = useState(false);
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	  // Call the   hook for websockets event listeners
    useJobApplicationCountWebsocket(logedUserData);
		
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			let userData = {userId:null }
			let url = `/get-user-job-vacancies?cursor=${jobList.cursor}`;
			  
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url,userData, authToken);
			 
			 //  console.log(data);
			if(data != null && data.status == true )
			{
				if(data.jobList.data.length != 0 )
				 {
					dispatch(updateMyJobState({type : 'SetJob', jobList: data.jobList.data}));
					} 
					dispatch(updateMyJobState({type : 'SetCursor', cursor: data.jobList.next_cursor})); 
					dispatch(updateMyJobState({type : 'SetHasMore', hasMore: data.jobList.next_cursor != null})); 
				  
			}
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
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
		  dispatch(updateMyJobState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
	 
	return ( 
		<>
			<PageSeo 
				title="My Jobs | SkillVilla"
				description="Manage the job listings you've created or posted on SkillVilla."
				keywords="my jobs, posted jobs, SkillVilla, job management"
			/>

			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={jobList.hasMore}
				loading={loading}
				initialScrollPosition={jobList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			>
				
				<JobHeader heading="My Jobs" myJob={true}/>
				
				{
					 (jobList.jobList.length <= 0 && !loading) ?
					 (
							<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<p className="no_posts_message  ">
								You haven't posted any job yet. Start by posting your first job!</p>
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

export default MyJobPage;
