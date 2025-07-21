 
import   {useEffect, useState, useCallback  }  from 'react';  
import {useDispatch, useSelector } from 'react-redux';  
import {  useParams } from 'react-router-dom';  
      

import InfiniteScrollContainer from '../../../Components/Common/InfiniteScrollContainer'; 
import JobApplicationPageHeader from '../../../Components/Customer/CompanyJobApplicationList/JobApplicationPageHeader'; 
import JobApplicationList from '../../../Components/Customer/CompanyJobApplicationList/JobApplicationList'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import {updateJobApplicationState} from '../../../StoreWrapper/Slice/JobApplicationSlice';
 
import serverConnection from '../../../CustomHook/serverConnection'; 

import useAddNewJobApplicationWebsocket from '../../../Websockets/Job/useAddNewJobApplicationWebsocket'; 
import useJobApplicationCountWebsocket from '../../../Websockets/Job/useJobApplicationCountWebsocket'; 




const JobApplicationPage = () => { 
	const { job_id } = useParams(); // get job_id from URL parameter
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const jobApplicationList = useSelector((state) => state.jobApplicationList); //selecting post List from store
	 
	const [loading, setLoading] = useState(false);
	 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	 // Call the hook for websockets event listeners
   useAddNewJobApplicationWebsocket(job_id);
   useJobApplicationCountWebsocket(logedUserData);
		   
	
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{
			setLoading(true);
			if(job_id == null || authToken==null){return;}
			let requestdata = {
					job_id: job_id,
					has_job: Object.keys(jobApplicationList.jobData).length === 0
			};

			let url = `/get-job-applications?cursor=${jobApplicationList.cursor}`;
			  
			 
			//call the function fetch  data fron server
			let data = await serverConnection(url, requestdata, authToken);
			 
			 // console.log(data);
			if(data != null && data.status == true )
			{
				if(data.job != null)
				{
					dispatch(updateJobApplicationState({type : 'SetJobData', jobData: data.job}));
					
				}
				 if(data.jobApplications.data.length != 0 )
				 { 
						dispatch(updateJobApplicationState({type :'SetJobApplication', jobApplicationList: data.jobApplications.data}));
					} 
					dispatch(updateJobApplicationState({type :'SetCursor', cursor: data.jobApplications.next_cursor})); 
					dispatch(updateJobApplicationState({type : 'SetHasMore', hasMore: data.jobApplications.next_cursor != null})); 
				 
			}
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[dispatch, jobApplicationList, authToken]); 

	useEffect(() => { 
		 // Create a cancel token source
		let source = axios.CancelToken.source(); 
		if(jobApplicationList.jobApplicationList.length == 0)
		{ 
			apiCall(); 
		} 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [jobApplicationList.jobApplicationList, authToken]);
	
	 
       
 	 
	//function to add currunt scroll location into redux state
	const handleScrollUpdate = useCallback((scrollTop) => {
		  dispatch(updateJobApplicationState({type : 'setScrollHeightPosition', scrollHeightPosition: scrollTop}));
    
  }, [dispatch]);
	
 
	 
 	 
	
	 
 
	return ( 
		<>
			<PageSeo 
				title={jobApplicationList?.jobData?.title ? `Apply for ${jobApplicationList.jobData.title} | SkillVilla` : 'Apply for a Job | SkillVilla'}
				description={jobApplicationList?.jobData?.title ? `Submit your application for the role of "${jobApplicationList.jobData.title}" on SkillVilla.` : 'Submit your job application and grow your career with SkillVilla.'}
				keywords={jobApplicationList?.jobData?.title ? `apply for job, ${jobApplicationList.jobData.title}, SkillVilla, job application` : 'apply job, SkillVilla, job form, job opportunity'}
			/>


			<InfiniteScrollContainer
				fetchData={apiCall}
				hasMore={jobApplicationList.hasMore}
				loading={loading}
				initialScrollPosition={jobApplicationList.scrollHeightPosition}
				onScrollUpdate={handleScrollUpdate}
			>
				<div className="px-2   px-sm-3 px-md-4 px-lg-5  py-2 ">
				
					{ 
						(jobApplicationList.jobData != null && Object.keys(jobApplicationList.jobData).length !== 0)&&
						(<JobApplicationPageHeader jobData={jobApplicationList.jobData}/>)
					}
				
					{
						(jobApplicationList.jobApplicationList.length <= 0 && !loading)
						?(
							 <p className="no_posts_message mt-3 ">Thier is no application for this job.</p>
							 
						):(
								<JobApplicationList jobApplicaitonList={jobApplicationList.jobApplicationList} />
						)
					}
				
				</div>
			 
				 
			</InfiniteScrollContainer>
		</>
	);
};

export default JobApplicationPage;
