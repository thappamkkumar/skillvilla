 

import   {memo, useEffect, useCallback, useState,useRef } from 'react';   

import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux';  
 
import AddStoriesForm from '../../../Components/Customer/AddStories/AddStoriesForm';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

  
import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';
import useStoriesWebsockets from './Stories/useStoriesWebsockets';

import {updateStoriesState  } from '../../../StoreWrapper/Slice/StoriesSlice'; 

const AddStoriesPage = ( ) => {
	
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	const [submitting, setSubmitting] = useState(false);
	const [formData, setFormData] = useState({ 
        story_file: null,  
    });
	const [errors, setErrors] = useState({});
	const isFirstRender = useRef(true); // Ref to track the first render

  const MAX_VIDEO_DURATION = 30; // Maximum video duration in seconds
	const MAX_FILE_SIZE = 10 * 1024 * 1024; // Maximum file size in bytes (10 MB)
 
 // Call the useStoriesWebsockets hook for websockets event listeners 
 useStoriesWebsockets();

 // Validate form
const validateForm = () => {
    const newErrors = {};

    // Validate story_file
    if (formData.story_file != null) {
        const validAttachmentTypes = ['image/jpeg', 'image/png', 'image/jpg', 'video/mp4'];

        // Check file type
        if (!validAttachmentTypes.includes(formData.story_file.type)) {
            newErrors.story_file = 'Only JPG, JPEG, PNG, and MP4 files are allowed.';
        }

        // Check file size
        if (formData.story_file.size > MAX_FILE_SIZE) {
            newErrors.story_file = `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)} MB.`;
        }

        // Check video duration if the file is a video
        if (formData.story_file.type === 'video/mp4') {
            const video = document.createElement('video');
            video.preload = 'metadata';

            video.onloadedmetadata = () => {
                window.URL.revokeObjectURL(video.src);
                if (video.duration > MAX_VIDEO_DURATION) {
                    setErrors(prevErrors => ({
                        ...prevErrors,
                        story_file: `Video duration must be less than ${MAX_VIDEO_DURATION} seconds.`
                    }));
                }
            };

            video.src = URL.createObjectURL(formData.story_file);
        }
    } else {
        newErrors.story_file = 'Your story is empty! Add a file to share something amazing.';
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
			} else {
					const source = axios.CancelToken.source(); // Create a cancel token source

					try
					{	  
					
						   
						setSubmitting(true);//set form submition true
						setErrors({});//set error empty
						
						let contentType = 'multipart/form-data'; 
						const resultData = await serverConnection('/add-new-stories', formData, authToken, contentType ); //console.log(resultData);
						if(resultData.status == true)
						{   
						 // Clear form fields 
							setsubmitionMSG( 'Story  is uploaded successfully');
							setShowModel(true);
							setSubmitting(false);
							isFirstRender.current = true;
							setFormData({
									 
									story_file: null,
									 
							}); //set formdata empty
							if(resultData.newStories != null)
							{ 
								 dispatch(updateStoriesState({type : 'addLoggedUserNewStories', newStory:resultData.newStories}));
							}
						}
						else
						{ 
							setsubmitionMSG(resultData.message);
							setShowModel(true);
							setSubmitting(false); 
							if(resultData.storyLimitReach == true)
							{
								dispatch(updateStoriesState({type : 'SetLoggedUserCanAddStory', canAddStory: !resultData.storyLimitReach })); 
							}
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
 
  
	  // Validate on formData change, but skip on the first render
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const validationErrors = validateForm();
        setErrors(validationErrors);
    }, [formData]);

 
	return ( 
		<>
			<PageSeo 
					title="Post New Story | SkillVilla"
					description="Share your professional story and inspire others on SkillVilla."
					keywords="post story, SkillVilla, share experience, user story, write story"
			/>

			<div  >
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				{
					submitting == false ? (
							<div className="mx-auto py-4   py-md-4 py-lg-5   px-2   px-sm-3 px-md-4 px-lg-5  rounded sub_main_container">
								<h3 className="pb-2 fw-bold">Add New Story </h3>
									<AddStoriesForm
											formData={formData}
											setFormData={setFormData}
											errors={errors}
											onSubmit={handleSubmit}
											 

									/>
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

export default memo(AddStoriesPage);
