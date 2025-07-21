 
import React, {memo, useCallback, useState, useRef }  from "react"; 
import { useSelector } from 'react-redux';  

import Form  from 'react-bootstrap/Form';
import  Button  from 'react-bootstrap/Button';
import   InputGroup from 'react-bootstrap/InputGroup';
import   Spinner  from 'react-bootstrap/Spinner'; 
import {BsSend, BsX, BsHeart, BsHeartFill} from 'react-icons/bs'; 

import MessageAlert from '../../MessageAlert'; 
import serverConnection from '../../../CustomHook/serverConnection';
 
const StoryDetailReviewInput = ({
	storyId,
	userLiked=false,
	updateStoryLikeCount=()=>{},
	updateStoryLike=()=>{},
	updateStoryCommentCount=()=>{}, 
	addNewComment=()=>{}, 
	
	} ) => { 


 const [isFocused, setIsFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false); //state for store info about form submition  
  const authToken = useSelector((state) => state.auth.token); //selecting token from store
	var inputRef =  useRef('');
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	
	const handleFocus = useCallback(() => {
    setIsFocused(true);
  },[]);
	
  const handleBlur = useCallback(() => {
    setIsFocused(false);
  },[]);
	//function for handel comment submition or upload Comment
	const handleCommentSubmit = useCallback(async(event) =>
	{
		event.preventDefault();
	 if(inputRef.current.value.trim() != '' && inputRef.current.value.trim() != null)
		{
			setIsSubmitting(true);
			try
			{
				let data = {
					story_id:storyId,
					comment:inputRef.current.value.trim(),
				}; 
				//call the function fetcg post data fron server
				let result = await serverConnection(`/upload-stories-comment`, data, authToken);
				 //console.log(result);
				if(result != null && result.status == true)
				{
					setsubmitionMSG( 'Comment is uploaded successfully.');
					setShowModel(true);
					updateStoryCommentCount(result.comments_count); 
					addNewComment(result.newComment);
					inputRef.current.value = ''; 
				}
				else
				{
					setsubmitionMSG( 'Oops! Something went wrong.');
					setShowModel(true); 
				}
				 
				setIsSubmitting(false);
				
			}
			catch(error)
			{
				 //console.log(error);
				setsubmitionMSG( 'Oops! Something went wrong.');
				setShowModel(true); 
			}
		}
		else
		{
			inputRef.current.value = '';
		} 
		
	},[storyId,authToken ]);
	 
	 
	const handleStoryLike = useCallback(async() =>
	{
	 
			try
			{
				let data = {
					story_id:storyId, 
				}; 
				//call the function  to like story
				let result = await serverConnection(`/like-stories`, data, authToken);
				 //console.log(result);
				if(result.status == true)
				{
					updateStoryLikeCount(result.likes_count);
					updateStoryLike(result.liked);
					//updateStoryLike(result.liked);
				}
				
			}
			catch(error)
			{
				// console.log(error);
				setsubmitionMSG( 'Oops! Something went wrong.');
				setShowModel(true); 
			}
		 
		
	},[authToken, storyId]);
	 
	 
	 
	 
	  
	return (  
		<>
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			
			<div className="d-flex align-items-center storyReviewInputContainer"  >
				<div>
				<Button   variant="light" id="story-like-button-button" title="Like " className={` py-0 px-2 fw-bold border-0 fs-4 postBTN ${userLiked && 'postLiked'} `} onClick={handleStoryLike}			>	{userLiked ? <BsHeartFill   /> : <BsHeart />} </Button>
				</div>
				<div className="w-100">
					<Form onSubmit={handleCommentSubmit}>
						<InputGroup className={`  ${isFocused && 'commentInputfocused'}`}> 
							<Form.Control placeholder="Enter test ..." className="commentInput" name="commentInput" ref={inputRef}   onFocus={handleFocus} onBlur={handleBlur} id="Comment Input" reqired="true" autoComplete="off" />
							<span className="p-2">
							
								<Button type="submit" variant="dark" id="comment-send-button-addon2" title="Send "     disabled={isSubmitting}>	{isSubmitting ? <Spinner className="text-white" size="sm" /> : <BsSend />}</Button>
								
								
							</span>
						</InputGroup>
					</Form>
				</div>
			</div>
		</>	 
		  
	);
	
};

export default memo(StoryDetailReviewInput);
