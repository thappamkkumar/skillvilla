 

import   {memo, useEffect, useCallback, useState } from 'react';   
import { useParams } from 'react-router-dom'; 
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
 
import AddFreelanceWorkForm from '../../../Components/Customer/AddFreelance/AddFreelanceWorkForm';
import MessageAlert from '../../../Components/MessageAlert';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import serverConnection from '../../../CustomHook/serverConnection'; 
 
import {updateFreelanceState} from '../../../StoreWrapper/Slice/MyFreelanceSlice';
 
const UpdateFreelanceWorkPage = ( ) => {
	
	const { freelance_id } = useParams(); // get job_id from URL parameter
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch 
  
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [loading, setLoading] = useState(false);
	const [submitting, setSubmitting] = useState(false);
	 
	const [formData, setFormData] = useState(null);
	const [errors, setErrors] = useState({});
 



	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			setLoading(true);
			if(freelance_id == null || authToken==null)
			{
				return;
			}
			let requestData = {freelance_id: freelance_id, } ;
			let url = `/get-freelance-work`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			  //console.log(data);
			 
			 if(data != null && data.freelanceData != null )
			 {     	
					setFormData(data.freelanceData);
			 } 
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[ authToken, freelance_id]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, freelance_id]);
	
	
	
	
	
	
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
						 
						 //console.log(formData);
						const resultData = await serverConnection('/update-freelance-work', formData, authToken ); 
						 // console.log(resultData);
						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Freelance Work  is updated successfully');
							setShowModel(true);
							setSubmitting(false); 
							 
							if(resultData.updatedFreelanceWork != null)
							{
								 
								dispatch(updateFreelanceState({type : 'updatedFreelance', updatedFreelance:resultData.updatedFreelanceWork}));
								
							}
							
							    
								
					 
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
				title={formData?.title ? `Edit ${formData.title} | SkillVilla` : 'Edit Freelance Gig | SkillVilla'}
				description={formData?.title ? `Update your gig titled "${formData.title}" on SkillVilla.` : 'Edit your freelance gig and manage work opportunities on SkillVilla.'}
				keywords={formData?.title ? `edit gig, ${formData.title}, SkillVilla, freelance update` : 'edit gig, SkillVilla, update freelance gig'}
			/>

			<div className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container">
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className="  px-2 py-4 p-sm-3 p-md-4 p-lg-5    rounded  sub_main_container    "  >
							
							<h3 className="pb-2 fw-bold">Update  Freelance Work</h3>
							 
							 <AddFreelanceWorkForm
									formData={formData}
									setFormData={setFormData}
									errors={errors}
									setErrors={setErrors}
									onSubmit={handleSubmit}
									submitting={submitting}
									update = {true}
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

export default memo(UpdateFreelanceWorkPage);
