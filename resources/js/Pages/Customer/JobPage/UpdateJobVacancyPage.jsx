 

import   {memo, useEffect, useCallback, useState } from 'react'; 
import { useParams } from 'react-router-dom';    
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner';  

import AddJobVacancyForm from '../../../Components/Customer/AddJobVacancy/AddJobVacancyForm';
import MessageAlert from '../../../Components/MessageAlert';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection';
   
import {updateJobState as updateMyJobState} from '../../../StoreWrapper/Slice/MyJobSlice';
 
const UpdateJobVacancyPage = ( ) => {
	
	const { job_id } = useParams(); // get job_id from URL parameter
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	   
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
 
	const [formData, setFormData] = useState(null);
	const [errors, setErrors] = useState({});
 


	const formatDateForInput = (dateString) => {
		if (!dateString) return '';
		
		const parts = dateString.split('-');
		if (parts.length !== 3) return '';

		// Check if it's already in the correct format
		if (parts[0].length === 4) return dateString;

		// Assuming format is DD-MM-YYYY
		const [day, month, year] = parts;
		return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
	};

	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			setLoading(true);
			if(job_id == null || authToken==null)
			{
				return;
			}
			let requestData = {job_id: job_id, } ;
			let url = `/get-job-vacancy`;
			 
			 
			//call the function fetch   data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			  // console.log(data);
			 
			 if(data != null && data.jobData != null )
			 {  
					 
					 const jobData = { ...data.jobData };

					// Format the expires_at field to 'YYYY-MM-DD'
					jobData.expires_at = formatDateForInput(jobData.expires_at);

					setFormData(jobData);
			 } 
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[ authToken, job_id]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, job_id]);
	
	
	
	
	
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
				console.log(validationErrors);
					setErrors(validationErrors);
					setsubmitionMSG( 'Form must be filled and valid');
					setShowModel(true);
							
			} else {
					const source = axios.CancelToken.source(); // Create a cancel token source

					try
					{	  
					
						   
						setSubmitting(true);//set form submition true
						setErrors({});//set error empty
						  
						const resultData = await serverConnection('/update-job-vacancy', formData, authToken ); 
						 console.log(resultData);
						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Job vacancy  is uploaded successfully');
							setShowModel(true);
							setSubmitting(false);
							 
							if(resultData.updatedJobData != null)
							{ 
								dispatch(updateMyJobState({type : 'updatedJob', updatedJob:resultData.updatedJobData}));
							}
					 
						}
						else
						{ 							  

							setsubmitionMSG('Failed to update the job vacancy. Please try again.');
							setShowModel(true);
							setSubmitting(false);
						}  
					} 
					catch (error)
					{
							console.error(error);
							setsubmitionMSG('An error occurred. Please try again.'); 
							setShowModel(true);
							setSubmitting(false);
						 
					}
			 
			 		
					 
			}
	},[authToken,formData, setErrors, setFormData, setSubmitting, setsubmitionMSG, setShowModel]);
	
 


	 
 if(loading || formData == null)
 {
	return (<div className="w-100 text-center py-4">
		<Spinner  animation="border" size="md" />
	</div>);
 } 
  
  
	//add job form
	return ( 
		<>
			<PageSeo 
				title={formData?.title ? `Edit ${formData.title} | SkillVilla` : 'Edit Job | SkillVilla'}
				description={formData?.title ? `Update the job posting titled "${formData.title}" on SkillVilla.` : 'Edit and manage your job listings on SkillVilla.'}
				keywords={formData?.title ? `edit job, ${formData.title}, SkillVilla, job update` : 'edit job, SkillVilla, update job posting'}
			/>


			<div className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container">
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className="  px-2 py-4 p-sm-3 p-md-4 p-lg-5   rounded   sub_main_container    "  >
						 
							 
							<h3 className="pb-2 fw-bold">Update Job Vacancy</h3>
							 
							
							<AddJobVacancyForm
													formData={formData}
													setFormData={setFormData}
													errors={errors}
													setErrors={setErrors}
													onSubmit={handleSubmit}
													submitting={submitting}
														update={true}
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

export default memo(UpdateJobVacancyPage);
