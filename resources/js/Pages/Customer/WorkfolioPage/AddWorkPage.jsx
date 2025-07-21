 

import   {memo, useEffect, useCallback, useState } from 'react';   

import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux'; 
 
import AddWorkForm from '../../../Components/Customer/AddWork/AddWorkForm'
import AddWorkFormPreviewImages from '../../../Components/Customer/AddWork/AddWorkFormPreviewImages'
import AddWorkFormWatchVideo from '../../../Components/Customer/AddWork/AddWorkFormWatchVideo'
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';

import {updateWorkfolioState} from '../../../StoreWrapper/Slice/MyWorkfolioSlice';

const AddWorkPage = ( ) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: [],
        images: null,
        video: null,
        other: null,
    });
	const [errors, setErrors] = useState({});
	const [previewImages, setPreviewImages] = useState(false);
	const [watchVideo, setWatchVideo] = useState(false);
	const [previewOtherFile, setPreviewOtherFile] = useState(false);


 // File size constants
	const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500 MB
	const MAX_OTHER_SIZE = 500 * 1024 * 1024; // 100 MB
	const MAX_IMAGES = 50; //total images can upload
	const MAX_TOTAL_IMAGE_SIZE = 50 * 1024 * 1024; // 50 MB

	// Validate form
	const validateForm = () => {
			const newErrors = {};

			// Validate text inputs
			if (!formData.title) newErrors.title = 'Title is required.';
			if (!formData.description) newErrors.description = 'Description is required.';
			if (formData.category.length === 0) newErrors.category = 'At least one category is required.'; // Validate categories


			// Validate images
			
			if (formData.images != null && formData.images.length > 0) {
				if (formData.images.length > MAX_IMAGES) {
						newErrors.images = `You can upload a maximum of ${MAX_IMAGES} images.`;
				} else {
						const validImageTypes = ['image/jpeg', 'image/png', 'image/jpg'];
						let totalImageSize = 0;
						for (let file of formData.images) {
								if (!validImageTypes.includes(file.type)) {
										newErrors.images = 'Only JPG, JPEG, and PNG files are allowed.';
										break;
								}
								totalImageSize += file.size;
						}

						 
						if (totalImageSize > MAX_TOTAL_IMAGE_SIZE) {
								newErrors.images = 'Total image size must not exceed 50 MB.';
						}
				}
		}


			 

			// Validate video file
			if (formData.video) {
					if (formData.video.type !== 'video/mp4') {
							newErrors.video = 'Only MP4 files are allowed.';
					} else if (formData.video.size > MAX_VIDEO_SIZE) {
							newErrors.video = `Video size must not exceed 500 MB.`;
					}
			}
			 

			// Validate other file
			if (formData.other) 
			{
					const allowedExtensions = ['zip', 'pdf'];
					const fileExtension = formData.other.name.split('.').pop().toLowerCase();
					const isValidType = allowedExtensions.includes(fileExtension);

					if (!isValidType) 
					{
							newErrors.other = 'Only ZIP and PDF files are allowed.';
					} 
					else if (formData.other.size > MAX_OTHER_SIZE) 
					{
							newErrors.other = 'File size must not exceed 100 MB.';
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
						const resultData = await serverConnection('/add-new-work', formData, authToken, contentType ); 
						 // console.log(resultData);

						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Work is uploaded successfully');
							setShowModel(true);
							setSubmitting(false);
							setFormData({
									title: '',
									description: '',
									category: [],
									images: null,
									video: null,
									other: null,
							}); //set formdata empty
							
							
							if(resultData.newWorkfolio != null)
							{
								dispatch(updateWorkfolioState({type : 'addNewWorkfolio', newWorkfolio:resultData.newWorkfolio}));
							}
							
						}
						else
						{ 
							setsubmitionMSG('Failed to add the work. Please try again');
							setShowModel(true);
							setSubmitting(false);
						} 
						
					} 
					catch (error)
					{
							if (axios.isCancel(error)) {
								console.log('Request canceled', error.message);
								setsubmitionMSG('An error occurred. Please try again.');
								setShowModel(true);
							} else {
								//console.error(error);
								setsubmitionMSG('An error occurred. Please try again.');
								setShowModel(true);
							}
							setSubmitting(false);
						 
					}
			 
			 		
					 
			}
	},[authToken,formData, setErrors, setFormData, setSubmitting, setsubmitionMSG, setShowModel]);
 
 //refresh the redux state for user workfolio page. because when new add it reflect on redux state.when state is null.it fetch from start
	useEffect(() => {  
		//dispatch(updateUserWorkfolioState({type : 'refresh'}));  
	}, []);  
 
 
	return ( 
		<>
			
			<PageSeo 
					title="Create New Workfolio | SkillVilla"
					description="Create and showcase your professional workfolio on SkillVilla."
					keywords="new workfolio, create workfolio, SkillVilla, showcase workfolio"
				/>

			<div  >
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
						<div className=" px-2 py-4 px-sm-3 px-md-4 px-lg-5    rounded      sub_main_container    "  >
							<h3 className="pb-2 fw-bold" >Add Your Work  </h3>
							<AddWorkForm
									formData={formData}
									setFormData={setFormData}
									errors={errors}
									onSubmit={handleSubmit}
									setPreviewImages={setPreviewImages}
									setWatchVideo={setWatchVideo}
									setPreviewOtherFile={setPreviewOtherFile}
									
							/>
						</div>
					): (
						<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
						<h5 className="no_posts_message"> Your submission is being processed. Please wait a moment. </h5> 
						</div>
					)
				}
				
				{formData.images != null &&
					<AddWorkFormPreviewImages previewImages={previewImages} setPreviewImages={setPreviewImages} images={formData.images } />
				}
				{formData.video != null &&
					<AddWorkFormWatchVideo watchVideo={watchVideo} setWatchVideo={setWatchVideo} video={formData.video } />
				}
				
			</div>
		</>
	);
	
};

export default memo(AddWorkPage);
