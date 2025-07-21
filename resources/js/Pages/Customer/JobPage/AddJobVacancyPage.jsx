 

import   {memo, useEffect, useCallback, useState } from 'react';   
import {useNavigate } from 'react-router-dom'; 
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
 import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button';

import AddJobVacancyForm from '../../../Components/Customer/AddJobVacancy/AddJobVacancyForm';
import AddJobInstructions from '../../../Components/Customer/AddJobVacancy/AddJobInstructions';
import MessageAlert from '../../../Components/MessageAlert';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection';
import handleImageError from '../../../CustomHook/handleImageError';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
 
import {updateJobState} from '../../../StoreWrapper/Slice/MyJobSlice';
 
const AddJobVacancyPage = ( ) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const [shouldNavigate, setShouldNavigate] = useState(false); // New state
    
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	const [jobId, setJobId] = useState(null);//set after job creation for navigate to adding questions
	const [companyData, setCompanyData] = useState(null);
	const [jobVacancyFormStatus, setJobVacancyFormStatus] = useState(false);
	
	const [formData, setFormData] = useState({
    title: '',
    description: '',
    salary: '',
    payment_type: '',
    job_location: '',
    employment_type: '',
    expires_at: '',
    skill_required: [],
    email: '',
    phone: '',
    work_from_home: false,   
    communication_language: '',
  });
	const [errors, setErrors] = useState({});
 



	//call api to check the  user has register company or not
	useEffect(() => {
  const checkCompanyRegistration = async () => {
    try {
			if(authToken == null){return}
			setLoading(true);
      const resultData = await serverConnection('/check-company-registeration', {}, authToken); 
        //console.log(resultData);
			setLoading(false); 
      if (resultData.status ==  true && resultData.company ==  null) 
			{
				//manageVisitedUrl(`/register-company`, 'append');
				navigate('/create/job/register-company');
		 
      }
			setCompanyData(resultData.company);
    } catch (error) {
      console.error(error);
			setLoading(false);
    }
  };

  checkCompanyRegistration();
}, [authToken]); 
	
	
	
 // Validate form
	const validateForm = () => {
			const newErrors = {};
 
			// Validate text inputs
			if (!formData.title) newErrors.title = 'Title is required.';
			if (!formData.description) newErrors.description = 'Description is required.';
			if (!formData.salary) newErrors.salary = 'Salary is required.';
			if (!formData.payment_type) newErrors.payment_type = 'Payment type is required.';
			if (!formData.job_location) newErrors.job_location = 'Location is required.';
			if (!formData.employment_type) newErrors.employment_type = 'Employment type is required.';
			if (!formData.expires_at) {
				newErrors.expires_at = 'Expiration date is required.';
			} else {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				if (new Date(formData.expires_at) <= tomorrow) {
						newErrors.expires_at = 'Expiration date must be greater than tomorrow.';
				}
			}
			if (!formData.email) {
				newErrors.email = 'Email is required.';
			} else if (!/\S+@\S+\.\S+/.test(formData.email)) {
				newErrors.email = 'Email is invalid.';
			}
			if (!formData.phone) {
				newErrors.phone = 'Phone number is required.';
			} else if (!/^\d{10}$/.test(formData.phone)) { // Assuming phone is 10 digits
				newErrors.phone = 'Phone number must be 10 digits.';
			}
			if (!formData.communication_language) newErrors.communication_language = 'Communication language is required.';

			// Validate skill_required (array of skills)
			if (formData.skill_required.length === 0) {
				newErrors.skill_required = 'At least one skill is required.';
			}
			 

			return newErrors;
	};
 
	 
	// Handle form submission
	const handleSubmit = useCallback(async(e) => {
		  e.preventDefault();
			const validationErrors = validateForm();
			if (Object.keys(validationErrors).length > 0) {
				//console.log(validationErrors);
					setErrors(validationErrors);
					setsubmitionMSG( 'Form must be filled and valid');
					setShowModel(true);
			} else {
					const source = axios.CancelToken.source(); // Create a cancel token source

					try
					{	  
					
						   
						setSubmitting(true);//set form submition true
						setErrors({});//set error empty
						  
						const resultData = await serverConnection('/add-new-job-vacancy', formData, authToken ); 
						 //  console.log(resultData);
						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Job  is uploaded successfully');
							setShowModel(true);
							setSubmitting(false);
							setShouldNavigate(true);
							 
							if(resultData.newJob != null)
							{
								setJobId(resultData.newJob.id)
								dispatch(updateJobState({type : 'addNewJob', newJob:resultData.newJob}));
							}
					 
						}
						else
						{ 							  

							setsubmitionMSG('Failed to add the job vacancy. Please try again.');
							setShowModel(true);
							setSubmitting(false);
						}  
					} 
					catch (error)
					{
							//console.error(error);
							setsubmitionMSG('An error occurred. Please try again.'); 
							setShowModel(true);
							setSubmitting(false);
						 
					}
			 
			 		
					 
			}
	},[authToken,formData, setErrors, setFormData, setSubmitting, setsubmitionMSG, setShowModel]);
	
	// Close modal and navigate to add qustions
	const handleModalClose = (val) => {
			setShowModel(false);
			if (shouldNavigate && jobId != null) {
				//let url = manageVisitedUrl(null, 'popUrl'); 
				//manageVisitedUrl(`/job-add-questions/${jobId}`, 'append');
				navigate(`/job-add-questions/${jobId}`);
			}
	};


	
 
 //handle open new job form to insert job realted data
	const handleGoToStepOne = useCallback(()=>{
		setJobVacancyFormStatus((prev)=>!prev);
		
	}, []);
   
	 
	 
 //handle navigate to company profile
	const navigateToCompanyProfile = useCallback(()=>{ 
		//manageVisitedUrl(`/company-profile/${companyData.id}`, 'append');
		navigate(`/company-profile/${companyData.id}`);
	}, [companyData]);
   
 if(loading)
 {
	return (<div className="w-100 text-center py-4">
		<Spinner  animation="border" size="md" />
	</div>);
 } 
 
 //instruction page 
 if(!jobVacancyFormStatus)
 {
	return (<div  >
			<PageSeo 
				title="Post New Job | SkillVilla"
				description="Create and share new job opportunities with the SkillVilla community."
				keywords="post job, new job, SkillVilla, job opportunity"
			/>
			<AddJobInstructions handleGoToStepOne={handleGoToStepOne}/>
	</div>);
 }
  
	//add job form
	return ( 
		<>
			<PageSeo 
				title="Post New Job | SkillVilla"
				description="Create and share new job opportunities with the SkillVilla community."
				keywords="post job, new job, SkillVilla, job opportunity"
			/>

			<div  >
				<MessageAlert setShowModel={handleModalClose} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className="  px-2 py-4 px-sm-3 px-md-4 px-lg-5   rounded   sub_main_container    "  >
						 
							{ 
								companyData != null &&
								<div className="d-flex  align-items-center   pb-3  "
								
								>
									<Image src={companyData.logo || '/images/login_icon.png'} className="nav_profile_img" onError={()=>{handleImageError(event, '/images/login_icon.png')} } alt={`logo of ${companyData.name}`}
									onClick={navigateToCompanyProfile}
									style={{'cursor':'pointer'}}
									/> 
									<div className="  ps-3    ">
										<Button 
											variant="link"
											className=" d-block border-0 post_tags text-decoration-none fw-bold  p-0 m-0 text-start "
											onClick={navigateToCompanyProfile}
											style={{'cursor':'pointer', 'backgroundColor':'transparent'}}
											title={`Go to ${companyData.name} profile`}
											id="conpanyProfileNavigateButton"
										>{companyData.name}</Button>
										<a href={companyData.website} className="post_tags" target="_blank" id="companyWebsiteLink" title={`Go to ${companyData.name} official  website`}>{companyData.website}</a>
							 
									</div>
								</div>
							}
							<h3 className="pb-2 fw-bold">Step 1: Provide Job Information</h3>
							 
							
							<AddJobVacancyForm
													formData={formData}
													setFormData={setFormData}
													errors={errors}
													setErrors={setErrors}
													onSubmit={handleSubmit}
													submitting={submitting}
											/>
						</div>
					): (
						<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
						<h5 className="no_posts_message"> Your submission is being processed. Please wait a moment. </h5> 
						</div>
					)
				}
				 
			</div>
		</>
	);
	
};

export default memo(AddJobVacancyPage);
