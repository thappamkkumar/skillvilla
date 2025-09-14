 

import   {memo, useEffect, useCallback, useState } from 'react';   

import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux'; 
import Button from 'react-bootstrap/Button'; 
import Form from 'react-bootstrap/Form';    
 

import UploadNewPostAttachment from '../../../Components/Customer/UploadPost/UploadNewPostAttachment';
import UploadNewPostTaggedUser from '../../../Components/Customer/UploadPost/UploadNewPostTaggedUser';
import UploadNewPostTags from '../../../Components/Customer/UploadPost/UploadNewPostTags';
import UploadNewPostDescription from '../../../Components/Customer/UploadPost/UploadNewPostDescription';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)



import { updatePostState  } from '../../../StoreWrapper/Slice/MyPostSlice';

import MessageAlert from '../../../Components/MessageAlert';
import serverConnection from '../../../CustomHook/serverConnection';

const UploadNewPostPage = ( ) => {
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const [taggedUser, setTaggedUser] = useState([]);
	const [tags, setTags] = useState([]);
	//const [taggedProject, setTaggedProject] = useState(null);
	const [files, setFiles] = useState(null);
	const [description, setDescription] = useState('');
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [submitting, setSubmitting] = useState(false);
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
 
	//refresh the redux state for post page.because when new add it reflect on redux state.when state is null.it fetch from start
	useEffect(() => {  
		//dispatch(updateUserPostState({type : 'refresh'}));  
	}, []);  

	
	
	
	
	
	
	
	//function use to submit post data to server
	const submitPostUpload = useCallback(async(event)=>{
		event.preventDefault();
		const source = axios.CancelToken.source(); // Create a cancel token source

		try
		{	  
			 
			if(files == null || files.length <= 0)
			{
				setsubmitionMSG( 'Attachment is empty');
				setShowModel(true);
				return;
			}
			if(tags.length <= 0)
			{
				setsubmitionMSG( 'Tags is required');
				setShowModel(true);
				return;
			}
			
			setSubmitting(true);
			//getting id of user that tagged the post from taggedUser
			const taggedUserID = taggedUser.map(item => item.id);
		 
			const formData = {
				attachment: files, 
				tags: tags, 
				description: description,
				tagged_user: taggedUserID,
			};
			// console.log(formData);
			let contentType = 'multipart/form-data'; 
			const resultData = await serverConnection('/upload-new-post', formData, authToken, contentType ); 
			 //console.log(resultData);
			if(resultData.status == true)
			{   
			 // Clear form fields 
				setsubmitionMSG( 'Post is uploaded successfully');
				setShowModel(true);
				setSubmitting(false);
				if(resultData.newPost != null)
				{
					dispatch(updatePostState({type : 'addNewPost', newPost:resultData.newPost}));
				}
			}
			else
			{ 
				setsubmitionMSG('Failed to add the post. Please try again.');
				setShowModel(true);
				setSubmitting(false);
			} 
			setDescription(''); 
			setTaggedUser([]);//set taggedUser empty array to refresh the form
			setTags([]);//set  Category empty array to refresh the form
		} 
		catch (error)
		{
        if (axios.isCancel(error)) {
          //console.log('Request canceled', error.message);
					setsubmitionMSG('An error occurred. Please try again.');
							setShowModel(true);
        } else {
          //console.error(error);
					setsubmitionMSG('An error occurred. Please try again.');
							setShowModel(true);
        }
				setSubmitting(false);
       
    }
	}, [authToken, files, taggedUser, description, tags ]);
	 
	return ( 
	 
	 <>
			<PageSeo 
				title="Create New Post | SkillVilla"
				description="Share your thoughts or work with the SkillVilla community."
				keywords="new post, create post, SkillVilla, share content"
			/>

			<div  >
				<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
				{
					submitting == false ? (
						 
							<div   className="mx-auto py-4       px-2   px-sm-3 px-md-4 px-lg-5 rounded sub_main_container">
								<h3 className="pb-2 fw-bold">Uplaod New Post  </h3>
								<Form onSubmit={submitPostUpload} autoComplete="off"> 
									 <UploadNewPostAttachment setFiles={setFiles}   />	
									 <UploadNewPostTaggedUser taggedUser={taggedUser} setTaggedUser={setTaggedUser} />	
										<UploadNewPostTags tags={tags} setTags={setTags}/>	 
									 <UploadNewPostDescription description={description}  setDescription={setDescription}/>	
										
									 <div className="pt-5 pb-3  ">
										<Button    type="submit"  variant="dark"    id="uploadPostSubmitBTNID" title="Submit new post" className="    w-100 "   >  Submit </Button>
									 </div>
									 
									
								</Form> 
							</div>
						 
					): (
						<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<h5 className="no_posts_message"   >Your submission is being processed. Please wait a moment. </h5>
							 
						</div>
					)
				}
				
			</div>
		</>
	);
	
};

export default memo(UploadNewPostPage);
