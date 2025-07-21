import react, {memo, useState, useEffect} from 'react';
import {useSelector } from 'react-redux'; 
import Carousel from 'react-bootstrap/Carousel';
import   Button  from 'react-bootstrap/Button';

import PostDetailAttachment from './PostDetailAttachment';

import {  BsChevronCompactLeft, BsChevronCompactRight   } from 'react-icons/bs';

const PostDetailAttachmentList = (postAttachments) =>
{ 
	const [index, setIndex] = useState(0);
	const [attachments, setAttachments] = useState();
	
	useState(()=>{
		if(postAttachments){
			 
			setAttachments(postAttachments.postAttachments);
		}
	}, [postAttachments]);
	
  const changeSlide = (slide) => {
		if(slide === 'prev' )
		{
			
			setIndex(index - 1); 
		}
		else
		{
			setIndex(index + 1); 
		}
    
  };
	 
	return(
		<div className="   postDetailAttachmentContainer  "    >
		{
			attachments &&
			(
				<>
				<PostDetailAttachment   index={index} attachment ={attachments[index]} />
							   
		 
				{
					index > 0 && <Button variant="*"	onClick={()=>{changeSlide('prev');}} className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"	id="postDetailVideoController-PrevBtn" title="Previous"><BsChevronCompactLeft  style={{ strokeWidth: '1', }} /></Button>
				}
				{
					index < attachments.length-1 && <Button variant="*"	onClick={()=>{changeSlide('next');}} className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"	id="postDetailVideoController-NextBtn" title="Next"><BsChevronCompactRight  style={{ strokeWidth: '1', }} /></Button>
				}
				</>
			)
			
		}
			
		 
		</div>
	);
};

export default memo(PostDetailAttachmentList);