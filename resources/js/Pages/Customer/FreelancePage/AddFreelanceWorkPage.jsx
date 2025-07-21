 

import   {memo,   useCallback, useState } from 'react';  
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
 
import AddFreelanceWorkForm from '../../../Components/Customer/AddFreelance/AddFreelanceWorkForm';
import MessageAlert from '../../../Components/MessageAlert';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection'; 
 
import {updateFreelanceState} from '../../../StoreWrapper/Slice/MyFreelanceSlice';
 
const AddFreelanceWorkPage = ( ) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	 const [submitting, setSubmitting] = useState(false);
	 
	const [formData, setFormData] = useState({
    title: '',
    description: '', 
    deadline: '',
    budget_min: '',
    budget_max: '',
    payment_type: '',
    experience_level: '',
    duration: '',
    skill_required: [],     
		
		
	    
  });
	const [errors, setErrors] = useState({});
 



	 
	
	
	
 // Validate form
	const validateForm = () => {
			const newErrors = {};
 
			// Validate text inputs
			if (!formData.title) newErrors.title = 'Title is required.';
			if (!formData.description) newErrors.description = 'Description is required.';
			if (!formData.budget_min)
			{
				newErrors.budget_min = 'Min budget  is required.';
			}
			else if (formData.budget_min < 0)
			{
				newErrors.budget_min = 'Min budget should be grater then 0.';
			}
				
			if (!formData.budget_max) 
			{
				newErrors.budget_max = 'Max budget is required.';  
			}
			else if (formData.budget_max < 0)
			{
				newErrors.budget_max = 'Max budget should be grater then 0.';
			}
			if(!!formData.budget_min && formData.budget_min > formData.budget_max)
			{
				newErrors.budget_max = 'Max budget should be grater then Min budget.';
			}
			if (!formData.payment_type) newErrors.payment_type = 'Payment type is required.';  
			if (!formData.experience_level) newErrors.experience_level = 'Experience level type is required.';  
			if (!formData.duration) newErrors.duration = 'Duration is required.';  
			if (!formData.deadline) {
				newErrors.deadline = 'Deadline date is required.';
			} else {
				const tomorrow = new Date();
				tomorrow.setDate(tomorrow.getDate() + 1);
				if (new Date(formData.deadline) <= tomorrow) {
						newErrors.deadline = 'Deadline date must be greater than tomorrow.';
				}
			}
			 

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
						 
						const resultData = await serverConnection('/add-new-freelance-work', formData, authToken ); 
						// console.log(resultData);
						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Freelance Work  is uploaded successfully');
							setShowModel(true);
							setSubmitting(false); 
							 
							if(resultData.newfreelanceWork != null)
							{
								 
								dispatch(updateFreelanceState({type : 'addNewFreelance', newFreelance:resultData.newfreelanceWork}));
								
							}
							
							   setFormData({
									title: '',
									description: '', 
									deadline: '',
									budget_min: '',
									budget_max: '',
									payment_type: '',
									experience_level: '',
									duration: '',
									skill_required: [],   
										
								}); 
								
					 
						}
						else
						{ 							  

							setsubmitionMSG('Failed to add the Freelance Work. Please try again.');
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
	
	 

	 
   
	  
  
  
	//add job form
	return ( 
		<>
			<PageSeo 
				title="Post New Freelance Gig | SkillVilla"
				description="Create a new freelance gig and connect with skilled professionals on SkillVilla."
				keywords="post freelance gig, create gig, SkillVilla, new freelance"
			/>

			<div  >
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className="  px-2 py-4 px-sm-3 px-md-4 px-lg-5  rounded    sub_main_container    "  >
							
							<h3 className="pb-2 fw-bold">Post a Freelance Opportunity</h3>
							 
							 <AddFreelanceWorkForm
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

export default memo(AddFreelanceWorkPage);
