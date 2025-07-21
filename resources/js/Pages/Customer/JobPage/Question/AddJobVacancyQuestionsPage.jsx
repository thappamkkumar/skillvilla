 

import   {memo, useEffect, useCallback, useState } from 'react'; 
import {useNavigate, useParams } from 'react-router-dom'; 
import {useSelector } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button';
import AddJobVacancyQuestionsForm from '../../../../Components/Customer/AddJobVacancyQuestions/AddJobVacancyQuestionsForm';

import MessageAlert from '../../../../Components/MessageAlert';
import PageSeo from '../../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../../CustomHook/serverConnection';
import handleImageError from '../../../../CustomHook/handleImageError';
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
  
const AddJobVacancyQuestionsPage = ( ) => {
	
	const { job_id } = useParams(); // get job_id from URL parameter
	 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [companyData, setCompanyData] = useState(null);
	const [jobData, setJobData] = useState(null);
	const [question, setQuestion] = useState("");
	const [timeLimit, setTimeLimit] = useState("");
  const [options, setOptions] = useState({ option1: "", option2: "", option3: "", option4: "" });
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [errors, setErrors] = useState({});
  
	
	
	//call api to check the  user has register company or not
	useEffect(() => {
		const checkCompanyRegistration = async () => {
			try {
				if(authToken == null || job_id == null){return}
				setLoading(true);
				const resultData = await serverConnection('/get-job-vacancy-data-for-adding-question', {job_id:job_id}, authToken); 
				  //console.log(resultData);
				setLoading(false);
				if (resultData.status ==  true && resultData.company !=  null && resultData.jobData !=  null) 
				{
					setCompanyData(resultData.company);
					const { id, title } = resultData.jobData;
					setJobData({ id, title });
					setTimeLimit(resultData.jobData.time_limit);
				
				}
				
			} catch (error) {
				//console.error(error);
				setLoading(false);
			}
		};

		checkCompanyRegistration();
	}, [authToken]); 
	
	
	
	//  validation function
  const validateForm = () => {
    const formErrors = {};
    if (!question) formErrors.question = "Question is required";
    if (!timeLimit) {
			formErrors.timeLimit = "Time limit is required";
		} else if (isNaN(timeLimit) || timeLimit <= 0) {
			formErrors.timeLimit = "Time limit must be a positive number";
		}
    Object.keys(options).forEach((key) => {
      if (!options[key]) formErrors[key] = `${key} is required`;
    });

    if (!correctAnswer) formErrors.correctAnswer = "Correct answer is required";

    return formErrors;
  };
	
	 
	
	 // Handle form submission
  const handleSubmit = useCallback(async(e) => {
    e.preventDefault();

    // Validate form fields
      // Call validation function and get errors
    const formErrors = validateForm();

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);  // Set errors if validation fails
      return;
    }
		setErrors({});
		
		
      // If no errors, handle form data submission
    setSubmitting(true);
    try {
      const formData = {
        job_id,
        question, 
        options,
        correctAnswer,
      };
     // Assume there's an API endpoint to save the question data
      const response = await serverConnection('/add-job-vacancy-question', formData, authToken);
			//console.log(response);
 
      if (response.status === true) {
        setsubmitionMSG('Question added successfully!');
        setShowModel(true);
        setQuestion('');
				 
        setOptions({ option1: '', option2: '', option3: '', option4: '' });
        setCorrectAnswer('');
      } else {
        setsubmitionMSG('Failed to add the question. Please try again.');
        setShowModel(true);
      }
    } catch (error) {
      setsubmitionMSG('An error occurred. Please try again.');
      setShowModel(true);
    } finally {
      setSubmitting(false);
    }
  },[question, options, correctAnswer, authToken, job_id]);


	//  question time limit onChange handlers
	const updateTimeLimit = useCallback(async(changedData) => {
		 
		try {
      const formData = {
        job_id:job_id,
        time_limit:changedData
      };
      
      const response = await serverConnection('/update-job-test-time-limit', formData, authToken);
			 //console.log(response);
 
      if (response.status === true) {
        setsubmitionMSG('Time limit is updated successfully!');
        setShowModel(true);
        setTimeLimit(changedData); 
				
      } else {
        setsubmitionMSG('Failed to update the job test time limit. Please try again.');
        setShowModel(true);
      }
    } catch (error) {
			//console.log(error);
      setsubmitionMSG('An error occurred. Please try again.');
      setShowModel(true);
    } 
	},[authToken, job_id]);
	
	
 
	//handle navigate to company profile
	const navigateToCompanyProfile = useCallback(()=>{ 
		//manageVisitedUrl(`/company-profile/${companyData.id}`, 'append');
		navigate(`/company-profile/${companyData.id}`);
	}, [companyData]);
	
	
	//handle navigate to job detail
	const navigateToJobDetail = useCallback(()=>{
		// manageVisitedUrl(`/job-detail/${job_id}`, 'append');
      navigate(`/job-detail/${job_id}`);
	}, [job_id]);
   
 if(loading)
 {
	return (<div className="w-100 text-center py-4">
		<Spinner  animation="border" size="md" />
	</div>);
 }
 
	return ( 
		<>
			<PageSeo 
				title="Add Test Question | SkillVilla"
				description="Create and manage questions for job entrance tests on SkillVilla."
				keywords="add question, entrance test, job test, SkillVilla, job application test"
			/>

			<div className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container">
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className="   px-2 py-4 p-sm-3 p-md-4 p-lg-5 rounded     sub_main_container   "  >
							 
							{ 
								companyData != null && jobData != null &&
								<>
									<div className="d-flex  align-items-center py-3 px-2  " >
										<Image 
											src={companyData.logo || '/images/login_icon.png'} 
											className="nav_profile_img" 
											onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
											alt={`logo of ${companyData.name}`}
											onClick={navigateToCompanyProfile}
											style={{'cursor':'pointer'}}
										/> 
										<div className="  ps-3    ">
											<Button 
											variant="link"
											className=" d-block border-0 post_tags text-decoration-none fw-bold  p-0 m-0 text-start "
											onClick={navigateToCompanyProfile}
											 
											title={`Go to ${companyData.name} profile`}
											id="conpanyProfileNavigateButton"
											>
												{companyData.name}
											</Button>
											<a href={companyData.website}
											className="post_tags"
											target="_blank"
											id="companyWebsiteLink" 
											title={`Go to ${companyData.name} official  website`}>
												{companyData.website}
											</a>
							 
										</div>
									</div>
									<div>
										<h4 className="pb-2 d-flex flex-wrap align-items-center fw-bold">
											<span>Step 2: Job-Related Question for</span>
											<Button variant="link" 
											className="p-0 px-2 fw-bold fs-4   " 
											id="navigateJobDetail" 
											title="Go to job detail"
											onClick={navigateToJobDetail}  >
												{jobData.title} 
											</Button>
											<span className="text-muted">[ Optional ]</span>
										</h4>
									</div>
									 
									
									<AddJobVacancyQuestionsForm
										question={question}
										timeLimit={timeLimit}
										options={options}
										correctAnswer={correctAnswer}
										errors={errors}
										handleSubmit={handleSubmit}
										setQuestion={setQuestion}  
										updateTimeLimit={updateTimeLimit}
										setOptions={setOptions}    
										setCorrectAnswer={setCorrectAnswer}   
									/>
								</>
								
							}
							
							 
							 
						</div>
					): (
						<div className="no_posts_message">
							<h5  >Your submission is being processed. Please wait a moment. </h5>
						</div>
					)
				}
				 
			</div>
		</>
	);
	
};

export default memo(AddJobVacancyQuestionsPage);
