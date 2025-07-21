 

import   {memo, useEffect, useCallback, useState } from 'react'; 
import {useSelector } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner';  
import  Button  from 'react-bootstrap/Button';  
import  Form  from 'react-bootstrap/Form';  
import InputGroup from 'react-bootstrap/InputGroup';
 import {  BsX   } from "react-icons/bs"; 

import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';
   
const UpdateJobVacancyTestTimeLimit = ({job_id, timeLimit,setJobDetail,handleNavigateUpdateTestTime}) => {
	  
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	 
	 
	  

	//  question time limit onChange handlers
	const updateTimeLimit = useCallback(async(e) => {
		const changedTimeLimit=e.target.value;
		try {
      const formData = {
        job_id:job_id,
        time_limit:changedTimeLimit
      };
      setSubmitting(true);
      const response = await serverConnection('/update-job-test-time-limit', formData, authToken);
			 //console.log(response);
 
      if (response.status === true) {
        setsubmitionMSG('Time limit is updated successfully!');
        setShowModel(true);
         // Update the jobDetail state
            setJobDetail((prev) => ({
                ...prev,
                time_limit: formData.time_limit, // Update only the time_limit field
            }));
      } else {
        setsubmitionMSG('Failed to update the job test time limit. Please try again.');
        setShowModel(true);
      }
			setSubmitting(false);
    } catch (error) {
			//console.log(error);
      setsubmitionMSG('An error occurred. Please try again.');
      setShowModel(true);
			setSubmitting(false);
    } 
	},[authToken, job_id]);
	
	
 
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
							 <Form.Group controlId="minutes" className=" flex-grow-1 "> 
									<Form.Select  
										className="formInput"
										value={timeLimit}  
										onChange={updateTimeLimit}  
										 
									>
										 <option value="" disabled>Select time limit</option>
										{[...Array(60).keys()].map((minute) => (
											<option key={minute + 1} value={minute + 1}>
												{minute + 1}
											</option>
										))}
										<option  disabled> </option>
									</Form.Select>
								 
							</Form.Group>
							<Button 
								variant="dark"
								className="rounded   px-1 py-1  fs-4 lh-1	 " 
								title="Update test time limit"
								id="goToUpdateTestTime"
								onClick={handleNavigateUpdateTestTime}
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

export default memo(UpdateJobVacancyTestTimeLimit);
