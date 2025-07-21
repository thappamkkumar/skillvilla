 
import React, {useState, memo, useCallback} from 'react';  
import  Image  from 'react-bootstrap/Image';  
import  Spinner  from 'react-bootstrap/Spinner';  
  

import handleImageError from '../../../CustomHook/handleImageError';

const PostAttachment= ({postID, attachment}) => { 
  //state to store image is loading or not
	const [loading, setLoading] = useState(true);
	
	//function for handle image loading
	const handleImageLoading = useCallback(() =>
	{  
		setLoading(false);
	},[]);
	
	
	 
	 
	return ( 
		<div className="  explorePostAttachmentContainer  RelativeContainer rounded "  >
		 
			<Image src={attachment || '/images/imageError.jpg'}   
			className={`explorePostAttachment ${loading ? 'd-none' : ''}`} // Hide image while loading
			onLoad={handleImageLoading}
			onError={()=>{handleImageError(event, '/images/imageError.jpg');
			handleImageLoading();} } 
			alt={`images of post ${postID}`}  
			  
			fluid />
		{
					loading &&
				 <div className={`w-100 h-100    d-flex justify-content-center align-items-center `}  style={{'position':'absolute', 'top':'0px', 'left':'0px', 'cursor':'pointer'}}>
						 <Spinner  className="d-block mx-auto" animation="border"  size="md" /> 
							 
						
						
					</div>
		}		 
			 
		</div>
	);
	
};

export default memo(PostAttachment);
