  import   {memo, useCallback}  from 'react';
import { useNavigate } from 'react-router-dom';  
import {useDispatch } from 'react-redux'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import { BsThreeDotsVertical ,  BsClipboardCheck, BsBookmarkCheck  , BsCardList     } from "react-icons/bs"; 

import {updateJobState as updateAppliedSavedJobState} from '../../../StoreWrapper/Slice/AppliedSavedJobSlice';
import {updateJobState as updateMyJobState} from '../../../StoreWrapper/Slice/MyJobSlice';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const JobHeader = ({heading="Jobs", myJob=false}) => { 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	//function use to handle navigation to add new problem
/*	const handleNavigateToAddJob = useCallback(()=>{
		 manageVisitedUrl(`/jobs/post-new`, 'append'); 
		 navigate('/jobs/post-new');
		 
	}, []);
 */
 
 
	//function use to handle navigation to applied jobs list
	const handleNavigateToAppliedJobs = useCallback(()=>{ 
		dispatch(updateAppliedSavedJobState({type : 'refresh'})); 
		//manageVisitedUrl('/jobs/applied', 'append');
		navigate('/jobs/applied');		
		 
	}, []);
	
	//function use to handle navigation to saved jobs list
	const handleNavigateToSavedJobs = useCallback(()=>{ 
		dispatch(updateAppliedSavedJobState({type : 'refresh'})); 
		//manageVisitedUrl('/jobs/saved', 'append');
		navigate('/jobs/saved');		
		 
	}, []);
 
	 //function use to handle navigation to following user jobs list
	const handleNavigateToMyJobs = useCallback(()=>{ 
		dispatch(updateMyJobState({type : 'refresh'})); 
		//manageVisitedUrl('/jobs/my-jobs', 'append');
		navigate('/jobs/my-jobs');		
		 
	}, []);
  
	return ( 
	 <div className=" d-flex gap-2 justify-content-between align-items-start  px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<h3 className="fw-bold  ">{heading} </h3>
			
			<Dropdown  >
				 <Dropdown.Toggle variant="light" id="jobDropDownMenuBtn" title="More"  className="    custom_dropdown_toggle_post_header   fs-5  px-2 pt-0 pb-1  ">
						<BsThreeDotsVertical  />
					</Dropdown.Toggle>
				 
				 
				<Dropdown.Menu className="p-2 border-0 dropdown_menu shadow" style={{overflow:'hidden',}}>
					{/*
						<Dropdown.Item as="button" variant="*" id="addNewJobBtn" title="Add New Job"  className="py-2   rounded  d-flex align-items-center  gap-2 navigation_link" onClick={handleNavigateToAddJob}><BsPlusSquare  /> <span className="px-2">New Job Vacancy</span></Dropdown.Item>
					*/}	
					
						{
							!myJob  && 
								<Dropdown.Item as="button" variant="*" id="myJobsBtn" title="My jobs"  className="py-2  rounded  d-flex align-items-center gap-2  navigation_link" onClick={handleNavigateToMyJobs}><BsCardList   /> <span className="px-2">My Jobs </span></Dropdown.Item>
						 
						}
						
						<Dropdown.Item as="button" variant="*" id="appliedJobsBTN" title="Applied jobs"  className="py-2  rounded  d-flex align-items-center gap-2  navigation_link" onClick={handleNavigateToAppliedJobs}><BsClipboardCheck    /> <span className="px-2">Applied Jobs</span></Dropdown.Item>
						
						<Dropdown.Item as="button" variant="*" id="savedJobsBTN" title="Saved jobs"  className="py-2  rounded  d-flex align-items-center gap-2  navigation_link" onClick={handleNavigateToSavedJobs}><BsBookmarkCheck    /> <span className="px-2">Saved Jobs </span></Dropdown.Item>
						 
						
					
					 
				</Dropdown.Menu>
			</Dropdown>
		</div>
	);
};

export default memo(JobHeader);