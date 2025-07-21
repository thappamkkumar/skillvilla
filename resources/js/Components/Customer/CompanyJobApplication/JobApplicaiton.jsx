 
import  {useCallback, memo} from 'react';   
import { useNavigate } from 'react-router-dom';  
import Button from 'react-bootstrap/Button';

import JobApplicationHeader from './JobApplicationHeader'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

 
const JobApplicaiton = ({jobApplication}) => { 
	  
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
 
	
	
	//function use to handle navigation to application detail
	const navigateApplicationDetail = useCallback(()=>{
		 
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/job-application-detail/${jobApplication.id}`, 'append');
			navigate(`/job-application-detail/${jobApplication.id}`);
		 
	}, [jobApplication.id]);
	
	return ( 
		<div className="    sub_main_container  p-2 p-md-3 rounded mb-2    " >
			{/*header*/}
			<JobApplicationHeader user={jobApplication.user}/>
			
			
			{/*job application  */}
			<div className="d-flex flex-wrap gap-3 justify-content-between align-items-center py-3 px-0">
				
				<div>
					<p  className="p-0 m-0">
						<strong>Status:</strong>
						<strong
							className={`ps-2   
								${jobApplication.status === 'accepted' && 'text-success'}
									${jobApplication.status === 'submitted' && 'text-primary'}
									${jobApplication.status === 'in_review' && 'text-warning'}
									${jobApplication.status === 'shortlisted' && 'text-info'}
									${jobApplication.status === 'interview_scheduled' && 'text-secondary'}
									${jobApplication.status === 'rejected' && 'text-danger'} 
							`}
						> 
							{jobApplication.status === 'accepted' && 'Accepted'}
						{jobApplication.status === 'submitted' && 'Submitted'}
						{jobApplication.status === 'in_review' && 'In Review'}
						{jobApplication.status === 'shortlisted' && 'Shortlisted'}
						{jobApplication.status === 'interview_scheduled' && 'Interview Scheduled'}
						{jobApplication.status === 'rejected' && 'Rejected'}  
						</strong>

						 
					</p>
					<p  className="p-0 m-0">
						<strong>Applied On:</strong>
						<span className=" ps-2">{jobApplication.created_at}</span>
					</p>
				</div>
				
				<div>
				{
					jobApplication.test_attempt != null &&
					(
						
							<p  className="p-0 m-0">
								<strong>Test Score:</strong>
								<span className=" ps-2">{jobApplication.test_attempt.status}</span>
							</p>
						
					) 
				} 
				</div>
				
			</div>
			
			<div className="px-0">
				<Button 
                variant="dark" 
                title="Applciation detail" 
                id="goToApplicationDetail" 
                className="  px-5    " 
                 
								onClick={navigateApplicationDetail}
							>
                Detail 
					</Button>
			</div>
			
		</div>
	);
	
};

export default memo(JobApplicaiton);
