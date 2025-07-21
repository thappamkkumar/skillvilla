 

import   {memo, useCallback, useState } from 'react'; 
import {useSelector,useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner';  
import  Button  from 'react-bootstrap/Button';  
import  Form  from 'react-bootstrap/Form';  
import InputGroup from 'react-bootstrap/InputGroup';
import {  BsX   } from "react-icons/bs"; 

import {updateJobApplicationState} from '../../../StoreWrapper/Slice/JobApplicationSlice';
 
import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';
   
const UpdateJobApplicaitonStatus = ({
	applicationId,
	applicationStatus,
	setJobApplicationDetail,
	handleCancleUpdateStatus
	
	}) => {
	  
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	const [selectedStatus, setSelectedStatus] = useState('');
	
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	  
	//  question time limit onChange handlers
	const updateStauts = useCallback(async(e) => {
		 
		try {
      const formData = {
        id:applicationId,
        status:selectedStatus
      };
			if(!selectedStatus)
			{
				return;
			}
      setSubmitting(true);
       const response = await serverConnection('/update-job-application-status', formData, authToken);
			//console.log(response);
 
      if (response.status === true) {
        setsubmitionMSG('Application status is updated successfully!');
        setShowModel(true);
         // Update the jobApplicationDetail state
            setJobApplicationDetail((prev) => ({
                ...prev,
                status: formData.status, // Update only the time_limit field
            }));
					
					//update bid status in redux state for job application
					dispatch(updateJobApplicationState({type :'updateJobApplicationStatus', newStatus: formData}));
          	
					 
      } else {
        setsubmitionMSG('Failed to update the  application status. Please try again.');
        setShowModel(true);
      } 
			setSubmitting(false);
    } catch (error) {
			 //console.log(error);
      setsubmitionMSG('An error occurred. Please try again.');
      setShowModel(true);
			setSubmitting(false);
    } 
	},[authToken, selectedStatus, applicationId]);
	
	
	
	
	
 
 if(submitting)
 {
	return (<div className="w-100 text-center  ">
		<Spinner  animation="border" size="sm" />
	</div>);
 }
 
	return ( 
		<div className="  ">
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
			{
				submitting == false && (
					<Form  >
						<InputGroup className=" align-items-center gap-2 ">
							 <Form.Group controlId="statusID" className=" flex-grow-1 "> 
									<Form.Select  
										className="formInput"
										value={applicationStatus}   
										onChange={(e) => setSelectedStatus(e.target.value)} 
									>
										<option value="" disabled>Select time limit</option>
										<option   value="submitted"> Submitted</option>  
										<option   value="in_review"> In Review</option>
										<option   value="shortlisted"> Shortlisted</option>
										<option   value="accepted"> Accepted</option> 
										<option   value="interview_scheduled"> Interview Scheduled</option>
										<option   value="rejected"> Rejected</option>
										  
									</Form.Select>
								 
							</Form.Group>
							<Button 
								variant="dark" 
								title="Update Status"
								id="goToUpdatestatus"
								onClick={updateStauts}
								className="rounded"
								>
								Submit
							</Button>
							<Button 
								variant="light"
								className="rounded   px-1 py-0 fs-4	 " 
								title="Cancel update status"
								id="cancleUpdateStatus"
								onClick={handleCancleUpdateStatus}
								>
								<BsX style={{ strokeWidth: '1.2',  }}/>
							</Button>
						</InputGroup>
					
					 
				 </Form>
					 
				) 
			}
			 
		</div>
	);
	
};

export default memo(UpdateJobApplicaitonStatus);
