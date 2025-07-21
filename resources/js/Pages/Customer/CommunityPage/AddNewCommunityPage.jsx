 

import   {memo,  useCallback, useState } from 'react';  
import {useSelector, useDispatch } from 'react-redux'; 
import  Spinner  from 'react-bootstrap/Spinner'; 
 
import AddNewCommunityForm from '../../../Components/Customer/AddCommunity/AddNewCommunityForm';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection'; 
 
import {updateCommunityState as updateYourCommunityState} from '../../../StoreWrapper/Slice/YourCommunitySlice';

const AddNewCommunityPage = ( ) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	 
	const [formData, setFormData] = useState({
    name: '',
    description: '', 
    privacy: 'public',
    content_share_access: 'everyone',
    image: null,
         
  });
	const [errors, setErrors] = useState({});
 



	 
	
	
	
 // Validate form
	const validateForm = () => {
			const newErrors = {};
 
			// Validate text inputs
			if (!formData.name) newErrors.name = 'Name is required.';
			if (!formData.description) newErrors.description = 'Description is required.';
			if (!formData.privacy) newErrors.privacy = 'Privacy is required.';
			if (!formData.content_share_access) newErrors.content_share_access = 'Content Share Access is required.';
			
			if(formData.image != null) 
			{
				const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg', ];  

				if (!validImageTypes.includes(formData.image.type)) 
				{
					newErrors.image = 'Only JPG, JPEG, PNG, PDF and ZIP files are allowed.';
				}
				if (formData.image.size > 5*1024 * 1024) 
				{
					newErrors.image = 'File size exceeds 5MB.';
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
						const resultData = await serverConnection('/communities/create-new', formData, authToken,contentType ); 
							//console.log(resultData);
						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Community  is createed successfully');
							 
							if(resultData.newCommunity!= null)
							{
								 
								dispatch(updateYourCommunityState({ type: 'addNewCommunity', communityData: resultData.newCommunity}));
								
							}
							
							setFormData({
									name: '',
									description: '', 
									privacy: '',
									content_share_access: '',
									image: null,
							}); 
								
					 
						}
						else
						{ 		 
							setsubmitionMSG('Failed to create the Community. Please try again.'); 
						}  
					} 
					catch (error)
					{
						 console.error(error);
							setsubmitionMSG('An error occurred. Please try again.'); 
							 
						
						 
					}
					finally
					{
							setShowModel(true);
							setSubmitting(false);
					}
			 
			 		
					 
			}
	},[authToken,formData, setErrors, setFormData, setSubmitting, setsubmitionMSG, setShowModel]);
	
	 

	 
   
	  
  
  
	//add job form
	return ( 
		<>
			<PageSeo 
				title="Create New Community | SkillVilla"
				description="Create a new community on SkillVilla and start connecting with like-minded individuals."
				keywords="add new community, create community, SkillVilla, community creation"
			/>
			<div  > 
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className="  px-2 py-4 p-sm-3 p-md-4 p-lg-5  rounded    sub_main_container    "  >
							
							<h3 className="pb-2 fw-bold">Create new community</h3>
							 
							 <AddNewCommunityForm
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

export default memo(AddNewCommunityPage);
