import {useState,useCallback} from "react";
import { useSelector } from 'react-redux';
import  Button  from 'react-bootstrap/Button'; 
import  Spinner  from 'react-bootstrap/Spinner';  

import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';

const JobApplicationAction = ({applicationId, setJobApplicationDetail }) => {
	const authToken = useSelector((state) => state.auth.token); // Selecting token from store
	const [submitting, setSubmitting]=useState(false);
	 const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  

	
		//  question time limit onChange handlers
	const updateStatus = useCallback(async(status) => {
		 
		try {
      const formData = {
        id:applicationId,
        status:status
      };
      setSubmitting(true);
       const response = await serverConnection('/update-job-application-status', formData, authToken);
			 // console.log(response);
 
      if (response.status === true) {
         setsubmitionMSG('Application status is updated successfully!');
					setShowModel(true);
        
         // Update the jobApplicationDetail state
            setJobApplicationDetail((prev) => ({
                ...prev,
                status: formData.status, // Update only the time_limit field
            }));
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
	},[authToken, applicationId]);
	
	
	if(submitting)
		{
			return (
				<div className="text-center pt-5 py-1">
						<Spinner  animation="border"   />
				  </div>
			);
		}
  return (
	 <>
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
		
    <div className="d-flex flex-wrap justify-content-center gap-3 pt-5">
			<Button variant="danger" 
			id="rejectApplicaiton" 
			title="Reject application"
			className=" px-5  "
			onClick={()=>{updateStatus('Rejected')}}
			>
			 Reject
			</Button>
			<Button variant="secondary"  
			id="acceptApplicaiton" 
			title="Accept application"
			className=" px-5 "
			onClick={()=>{updateStatus('Accepted')}}
			>
				  Accept 
			</Button>
			
    </div>
	</> 
  );
};

export default JobApplicationAction;
