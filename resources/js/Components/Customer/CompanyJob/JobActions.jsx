import { memo, useCallback } from 'react';
import {useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'; 
import {  BsBookmarkPlus, BsBookmark  } from 'react-icons/bs';
import {updateJobState} from '../../../StoreWrapper/Slice/JobSlice';
import {updateJobState as updateUserJobState} from '../../../StoreWrapper/Slice/UserJobSlice';
import {updateJobState as updateAppliedSavedJobState} from '../../../StoreWrapper/Slice/AppliedSavedJobSlice'; 
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice';

//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';

const JobActions = ({ 
		job_id,
		is_expired,
    already_applied, 
    attempts, 
    has_saved,  
		applications,
		updateJobDetailSave=()=>{},
}) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
     
    
	//function use to navigate job apply page
		const navigateApplyForJob= useCallback(()=>{
			//manageVisitedUrl(`/job-apply/${job_id}`, 'append');
			navigate(`/job-apply/${job_id}`);
		 
		}, [job_id]);
		
		//function use to call api to save and unsave job
	const handleJobSave = useCallback(async()=>{
		
		try
		{ 
			if(job_id == null){return;}
			let data = {
				job_id:job_id,  
			}; 
			let result = await serverConnection(`/save-job-vacancy`, data, authToken);
			//console.log(result);
			if(result.status == true)
			{
				const savedJobData = {
					'has_saved':result.has_saved,
					'job_id':job_id
				};
				updateJobDetailSave(savedJobData);
				dispatch(updateJobState({type : 'updateJobSaves', savedData:savedJobData}));
				dispatch(updateUserJobState({type : 'updateJobSaves', savedData: savedJobData}));
				dispatch(updateAppliedSavedJobState({type : 'updateJobSaves', savedData: savedJobData}));
				dispatch(updateFeedState({type : 'updateFeedSaves', savedData: {
					'has_saved':result.has_saved,
					'feed_id':job_id,
					'feed_type':'job',
				} }));
			 
			}
		}
		catch(error)
		{
			 console.log(error);
			 
		}
		 
		 
	}, [job_id, authToken]);
	
	
		 
	 
		
		
    return (
        <>
					{/* Show application status */}
					{already_applied && applications && applications.length > 0 && (
						<strong
							className={`pe-3
								${applications[0].status === 'accepted' && 'text-success'}
								${applications[0].status === 'submitted' && 'text-primary'}
								${applications[0].status === 'in_review' && 'text-warning'}
								${applications[0].status === 'shortlisted' && 'text-info'}
								${applications[0].status === 'interview_scheduled' && 'text-secondary'}
								${applications[0].status === 'rejected' && 'text-danger'}
							`}
						>
							{applications[0].status === 'accepted' && 'Accepted'}
							{applications[0].status === 'submitted' && 'Submitted'}
							{applications[0].status === 'in_review' && 'In Review'}
							{applications[0].status === 'shortlisted' && 'Shortlisted'}
							{applications[0].status === 'interview_scheduled' && 'Interview Scheduled'}
							{applications[0].status === 'rejected' && 'Rejected'}
						</strong>
					)}

					{/* Show message if the user has already applied */}
					{already_applied && (!applications || applications.length === 0) && (
						<strong className="text-success   pe-3">
							 Already Applied 
						</strong>
					)}
					
					{/* Show test failure message if applicable */}
					{!already_applied && attempts && attempts.length > 0 && !attempts[0].status && (
						<strong className="text-danger  pe-3 ">
							Test Failed 
						</strong>
					)}
					
					
					
					{/* Show deadline message if the job is expired and not already applied */}
					{!already_applied && is_expired && (
						<strong className="text-danger   pe-3   ">
							 Job Expired 
						</strong>
					)}
				 
				 
				 
				 
				 {/* Show button if not expired and not already applied */}
					{!already_applied && !is_expired && 
						(attempts && ((attempts.length > 0 && attempts[0].status) || attempts.length == 0) ) 
						&& 
						(
						<Button 
                variant="dark" 
                title="Apply for job" 
								id={`jobApplybtn${job_id}`}   
								onClick={navigateApplyForJob}
							>
                Apply 
							</Button>
					)}
				 
				 
				 
				 
            <Button 
                variant="light" 
                title={has_saved ? "Saved" : "Save job"} 
								id={`savJobbtn${job_id}`} 
								 
								onClick={handleJobSave}
            >
							{has_saved ? <BsBookmark /> : <BsBookmarkPlus /> }
							<span className="ps-2">{has_saved ? "Saved" : "Save"} 	</span>						
                
            </Button>
        </ >
    );
};

export default memo(JobActions);
