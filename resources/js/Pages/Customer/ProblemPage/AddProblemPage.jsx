 

import   {memo, useEffect, useCallback, useState } from 'react';   
 
import {useSelector, useDispatch } from 'react-redux'; 
 
import AddProblemForm from '../../../Components/Customer/AddProblem/AddProblemForm'
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
 
import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';

import {updateProblemState  } from '../../../StoreWrapper/Slice/MyProblemSlice';

const AddProblemPage = ( ) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	 const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState({
        title: '',
        description: '', 
        attachment: null,
        url: '', 
    });
	const [errors, setErrors] = useState({});
 

 // Validate form
	const validateForm = () => {
			const newErrors = {};

			// Validate text inputs
			if (!formData.title) newErrors.title = 'Title is required.';
			if (!formData.description) newErrors.description = 'Description is required.'; 

			// Validate attachment 
			
			if(formData.attachment != null) 
			{
				const validAttachmnetTypes = ['image/jpeg', 'image/png', 'image/jpg','application/zip', 'application/pdf'];  

				if (!validAttachmnetTypes.includes(formData.attachment.type)) 
				{
					newErrors.attachment = 'Only JPG, JPEG, PNG, PDF and ZIP files are allowed.';
				}
			}		 
			 
			// Validate URL
			if ( formData.url != '')
			{
				if (formData.url && !/^(ftp|http|https):\/\/[^ "]+$/.test(formData.url)) {
						newErrors.url = 'Please enter a valid URL.';
				}
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
						
						let contentType = 'multipart/form-data'; 
						const resultData = await serverConnection('/add-new-problem', formData, authToken, contentType ); 
						 //console.log(resultData);
						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Problem  is uploaded successfully');
							setShowModel(true);
							setSubmitting(false);
							setFormData({
									title: '',
									description: '',
									attachment: null,
									url: '', 
							});
							
							if(resultData.newProblem != null)
							{
								dispatch(updateProblemState({type : 'addNewProblem', newProblem:resultData.newProblem}));
							}
					 
						}
						else
						{ 
							setsubmitionMSG('Failed to add the problem. Please try again.');
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
 
 //refresh the redux state for user problem page. because when new add it reflect on redux state.when state is null.it fetch from start
	useEffect(() => {  
		//dispatch(updateUserProblemState({type : 'refresh'}));  
	}, []);  
 
 
	return ( 
		<>
			<PageSeo 
				title="Post New Problem | SkillVilla"
				description="Share your problem with professionals on SkillVilla. Engage with the community to find solutions."
				keywords="post new problem, SkillVilla, share problem, professional problem"
			/>

			<div  >
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className="   px-2 py-4 px-sm-3 px-md-4 px-lg-5      rounded    sub_main_container    "  >
							<h3 className="pb-2 fw-bold" >Add New Problem </h3>
							<AddProblemForm
									formData={formData}
									setFormData={setFormData}
									errors={errors}
									onSubmit={handleSubmit}
								 
							/>
						</div>
					): (
						<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
						<h5 className="no_posts_message" >Your submission is being processed. Please wait a moment. </h5> 
						</div>
					)
				}
				 
			</div>
		</>
	);
	
};

export default memo(AddProblemPage);
