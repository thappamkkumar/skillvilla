 

import  {memo, useEffect, useCallback, useState } from 'react';   
import {useNavigate, useParams } from 'react-router-dom'; 
import {useSelector  } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner';  

import JobApplyInstructions from '../../../Components/Customer/CompanyJobApply/JobApplyInstructions';
import JobApplyTest from '../../../Components/Customer/CompanyJobApply/JobApplyTest';
import JobApplyForm from '../../../Components/Customer/CompanyJobApply/JobApplyForm';
import MessageAlert from '../../../Components/MessageAlert';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
 
//import {updateJobState} from '../../../StoreWrapper/Slice/JobSlice';
 
const JobApplyPage = ( ) => {
	const { job_id } = useParams(); // get job_id from URL parameter
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
 	const navigate = useNavigate(); //geting reference of useNavigate into navigate 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [loading, setLoading] = useState(false); 
	const [alreadyApplied, setAlreadyApplied] = useState(false); 
	const [alreadyTestCompleted, setAlreadyTestCompleted] = useState(null); 
	const [testQuestions, setTestQuestions] = useState([]); 
	const [timeLimit, setTimeLimit] = useState(1); 
	const [jobApplyStep, setJobApplyStep] = useState(0); 
	
	const [shouldNavigateToNextStep, setShouldNavigateToNextStep] = useState(0); 
 

 //call api to check the  user has register company or not
	useEffect(() => {
  const checkCompanyRegistration = async () => {
    try {
			if(authToken == null || job_id == null){return}
			setLoading(true);
      const resultData = await serverConnection('/apply-job/check', {job_id:job_id}, authToken); 
         
         console.log(resultData);
			if(resultData != null && resultData.status == true)
			{
				if(resultData.already_applied != null && resultData.already_applied == true)
				{
					setAlreadyApplied(true);
					 
				}
				else{
					if(resultData.attempts == null)
					{
						setTestQuestions(resultData.testQuestions);
						setTimeLimit(resultData.timeLimit)
						if(resultData.testQuestions != null && resultData.testQuestions.length<=0)
						{
							setJobApplyStep(2);
						}
					}
					else if(resultData.already_applied != null && resultData.already_applied == false )
					{
						 
						setAlreadyTestCompleted(resultData.attempts);
					}
					else{}
					
				}
				 
				 
			}
			else{
				setsubmitionMSG('Something went wrong. Please try again.');
				setShowModel(true);
			}
			setLoading(false); 
       
    } catch (error) {
      console.error(error);
			setsubmitionMSG('An error occurred. Please try again.');
			setShowModel(true);
			setLoading(false);
    }
  };

  checkCompanyRegistration();
}, [authToken, job_id]); 
	
	
	const handleShowApplyPage = useCallback(() => {
		if(alreadyApplied == false)
		{
			
			if(alreadyTestCompleted == null)
			{  
				if(testQuestions != null && testQuestions.length > 0)
				{
					setJobApplyStep(1); 
				}
				else{
					setJobApplyStep(2); 
				}
				
			}
			else if(alreadyTestCompleted.status == true)
			{  
				setJobApplyStep(2); 
			}
		}
		
		
  },[testQuestions]);
	
	
	// Close modal {message box} and navigate to job detail
	const handleModalClose = useCallback((val) => {
			setShowModel(false);
			//if instruction page open then no navigate to next step
			if(shouldNavigateToNextStep == 0)
			{
				return;
			}
			//if test step open and test complete then nevigate to job apply step
			if(shouldNavigateToNextStep == 2)
			{
				if(alreadyTestCompleted != null && alreadyTestCompleted.status == true)
				{
					setJobApplyStep(2);
				}
				else{ 
					setJobApplyStep(0);
				}
				
				return;
			}
			//if job apply step open and job applied then navigate to previous page or back
			if (shouldNavigateToNextStep == 3  ) {
				//call function to pop the url from array of visited url
					//let url = manageVisitedUrl(null, 'popUrl'); 
					navigate(-1); 
			}
	},[shouldNavigateToNextStep,alreadyTestCompleted ]); 
   
	 
	 
	 
 if(loading && alreadyApplied == false)
 {
	return (<div className="w-100 text-center py-4">
		<Spinner  animation="border" size="md" />
	</div>);
 }
 
 if(alreadyApplied)
 {
	return (
		<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<p className="no_posts_message bg-success test-white ">You have already applied for this job</p>
		</div>
	);
 }
 
	return ( 
		<>
			<PageSeo 
  title="Apply for a Job | SkillVilla"
  description="Submit your application and take the next step in your career with SkillVilla."
  keywords="apply job, job application, SkillVilla, career opportunity"
/>

			<div className="pt-0 pt-md-4 pb-5 px-0 px-md-4 main_container">
				<MessageAlert setShowModel={handleModalClose} showModel={showModel} message={submitionMSG}/>	
					{
						jobApplyStep == 0 && 
						<JobApplyInstructions 
							alreadyTestCompleted={alreadyTestCompleted} 
							handleShowApplyPage={handleShowApplyPage}
						/>
					}
					{
						jobApplyStep == 1 && 
						<JobApplyTest 
							testQuestions={testQuestions} 
							timeLimit={timeLimit} 
							setsubmitionMSG={setsubmitionMSG}
							setShowModel={setShowModel}
							job_id={job_id}
							authToken={authToken}
							setAlreadyTestCompleted={setAlreadyTestCompleted}
							setShouldNavigateToNextStep={setShouldNavigateToNextStep}
						/>
						
					}
					{
						jobApplyStep == 2 && 
						<JobApplyForm 
							setsubmitionMSG={setsubmitionMSG}
							setShowModel={setShowModel}
							job_id={job_id}
							authToken={authToken}
							setShouldNavigateToNextStep={setShouldNavigateToNextStep}
						
						/>
					
					}
					
			</div>
		</>
	);
	
};

export default memo(JobApplyPage);
