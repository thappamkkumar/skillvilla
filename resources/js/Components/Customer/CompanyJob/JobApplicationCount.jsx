import {useCallback} from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import   Button   from 'react-bootstrap/Button'; 
import {updateJobApplicationState} from '../../../StoreWrapper/Slice/JobApplicationSlice';
 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';


const JobApplicationCount = ({job_id, totalApplications, }) => {
	const navigate = useNavigate(); // Reference for navigation
	const dispatch = useDispatch(); // Reference for dispatch
  
	// Navigate to job applications
  const handleNavigateJobApplication = useCallback(() => {
		dispatch(updateJobApplicationState({ type: 'refresh' }));
    //manageVisitedUrl(`/job-applications/${job_id}`, 'append');
    navigate(`/job-applications/${job_id}`);
  }, [job_id, navigate]);
	
	
	const handleNavigateAddJobVacancyQuestion = useCallback(( ) => {
    //manageVisitedUrl(`/job-add-questions/${job_id}`, 'append');
		navigate(`/job-add-questions/${job_id}`);
  },[job_id]);
	
  return (
    <>
		<Button 
			variant="dark"
			className="  d-flex flex-wrap gap-2 align-items-center justify-content-center"
			title="Total Application"
			id={`goToApplicationList${job_id}`}
			onClick={handleNavigateJobApplication}
			>
			<strong className=" px-2 rounded    bg-light text-dark  ">{totalApplications ?? 0}  </strong>
			<span className=" ">Applications</span>
		</Button>
		 
			<Button 
			variant="light" 
			title="Add Questions"
			id={`goToAddQuestion${job_id}`}
			onClick={handleNavigateAddJobVacancyQuestion}
			>
			 
			<span className=" ">Add Questions</span>
		</Button>
		 
		
		</>
  );
};

export default JobApplicationCount;
