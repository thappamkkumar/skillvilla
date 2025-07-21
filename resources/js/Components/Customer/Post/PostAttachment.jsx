 
import React, {useState, memo, useCallback} from 'react';  
import {useNavigate } from 'react-router-dom'; 
import  Image  from 'react-bootstrap/Image';  
import  Spinner  from 'react-bootstrap/Spinner';  
import  Button  from 'react-bootstrap/Button';  
import {BsPlayFill,   } from 'react-icons/bs'; 

import handleImageError from '../../../CustomHook/handleImageError';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';

const PostAttachment= ({postID, attachment}) => { 
  //state to store image is loading or not
	const [loading, setLoading] = useState(true);
	 const navigate = useNavigate(); //geting reference of useNavigate into navigate
	 
	//function for handle image loading
	const handleImageLoading = () =>
	{  
		setLoading(false);
	}
	const navigateToPostDetail = useCallback(() =>
	{  
		//call function to add current url into array of visited url
		//manageVisitedUrl(`/post-detail/${postID}`, 'append');
		navigate(`/post-detail/${postID}`); 
	}, []);
	 
	  
	 
	return ( 
		<div className="  postAttachmentContainer RelativeContainer  "  >
		 
			<Image src={attachment || '/images/imageError.jpg'}   
			className={`postAttachment ${loading ? 'd-none' : ''}`} // Hide image while loading
			onLoad={handleImageLoading}
			onError={()=>{handleImageError(event, '/images/imageError.jpg');
			handleImageLoading();} } 
			alt={`images of post ${postID}`}  
			 
			fluid />
		
		 
				 
			{/**/}
			<div className={`w-100 h-100    d-flex justify-content-center align-items-center `} onClick={navigateToPostDetail}  style={{'position':'absolute', 'top':'0px', 'left':'0px', 'cursor':'pointer'}}>
				{
					loading && (<Spinner  className="d-block mx-auto" animation="border"  size="md" />)
					 
				}
				
			</div>
			 
			
			
		</div>
	);
	
};

export default memo(PostAttachment);
