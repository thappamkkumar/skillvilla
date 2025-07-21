import {memo, useState, useCallback} from "react";
import Button from "react-bootstrap/Button";

import UpdateJobApplicaitonStatus from '../CompanyJobApply/UpdateJobApplicaitonStatus';

const JobApplicationDetailApplicationStatus = ({
	applicationId, 
	applicationStatus, 
	setJobApplicationDetail,
	}) => {
	const [updateStatus, setUpdateStatus] = useState(false);
	
	
	const handleCancleUpdateStatus = useCallback(()=>{
		setUpdateStatus((pre)=>(!pre));
	},[]);
	
	if(updateStatus == true)
	{
		return(
			<div className="py-3  ">
			
				<UpdateJobApplicaitonStatus
				applicationId={applicationId}
				applicationStatus={applicationStatus}
				setJobApplicationDetail={setJobApplicationDetail}
				handleCancleUpdateStatus={handleCancleUpdateStatus}
				/>
			</div>
		);
	}
	
  return (
    <div className="py-3 d-flex flex-wrap gap-2 justify-content-between align-items-center ">
			<div>
				<strong>  Status : </strong> 
				<strong className={`py-3     
									${applicationStatus === 'accepted' && 'text-success'}
									${applicationStatus === 'submitted' && 'text-primary'}
									${applicationStatus === 'in_review' && 'text-warning'}
									${applicationStatus === 'shortlisted' && 'text-info'}
									${applicationStatus === 'interview_scheduled' && 'text-secondary'}
									${applicationStatus === 'rejected' && 'text-danger'}   
								`}
				>
						{applicationStatus === 'accepted' && 'Accepted'}
						{applicationStatus === 'submitted' && 'Submitted'}
						{applicationStatus === 'in_review' && 'In Review'}
						{applicationStatus === 'shortlisted' && 'Shortlisted'}
						{applicationStatus === 'interview_scheduled' && 'Interview Scheduled'}
						{applicationStatus === 'rejected' && 'Rejected'}  
				</strong> 
			</div>
			<div>
				<Button variant="secondary" 
				id="changeApplicationStatus" 
				title="Update Application Status" 
				onClick={handleCancleUpdateStatus}
				>
					Update Status
				</Button>
			</div>
    </div>
  );
};

export default memo(JobApplicationDetailApplicationStatus);
