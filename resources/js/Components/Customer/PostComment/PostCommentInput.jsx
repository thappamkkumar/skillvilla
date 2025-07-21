import React, {memo, useCallback, useState, useRef }  from "react"; 
import { useSelector, useDispatch } from 'react-redux';  
import Form  from 'react-bootstrap/Form';
import  Button  from 'react-bootstrap/Button';
import   InputGroup from 'react-bootstrap/InputGroup';
import   Spinner  from 'react-bootstrap/Spinner'; 
import {BsSend, BsX} from 'react-icons/bs'; 

import { updatePostState } from '../../../StoreWrapper/Slice/PostSlice';
import { updatePostState as updateUserPostState } from '../../../StoreWrapper/Slice/UserPostSlice';
import { updatePostState as updateTaggedSavedPostState } from '../../../StoreWrapper/Slice/TaggedSavedPostSlice';
import { updatePostState as updateMyPostState } from '../../../StoreWrapper/Slice/MyPostSlice'; 
import { updateCommentState } from '../../../StoreWrapper/Slice/CommentSlice';
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice';

import serverConnection from '../../../CustomHook/serverConnection';
const PostCommentInput = ({updatePostDetailCommentCount=()=>{}}) =>
{
	const [isFocused, setIsFocused] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false); //state for store info about form submition  
	const postID = useSelector((state) => state.commentList.postID); //selecting post id  from store to fetch comments
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	var inputRef =  useRef('');
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	
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
					post_id:postID,
					comment:inputRef.current.value.trim(),
				}; 
				//call the function fetcg post data fron server
				let result = await serverConnection(`/upload-post-comment`, data, authToken);
				
				if(result.status == true)
				{
					//   console.log(result);
					updatePostDetailCommentCount(result.commentCount);
					dispatch(updateCommentState({type : 'SetNewComment', newComment: result.newComment}));
					
					dispatch(updatePostState({type : 'updateCommentCount', commentCount: result.commentCount}));
					dispatch(updateUserPostState({type : 'updateCommentCount', commentCount: result.commentCount}));
					dispatch(updateTaggedSavedPostState({type : 'updateCommentCount', commentCount: result.commentCount}));
					dispatch(updateMyPostState({type : 'updateCommentCount', commentCount: result.commentCount}));
					dispatch(updateFeedState({type : 'updateFeedPostCommentCount', 
						commentCountData: {
							'post_comment_feed_id': result.commentCount.postId,
							'post_comment_feed_type': 'post',
							'post_comment_count': result.commentCount.comments_count,
							
						} 
					}));
					
					inputRef.current.value = ''; 
					
				}
				setIsSubmitting(false);
			}
			catch(error)
			{
				//console.log(error);
				setIsSubmitting(false);
			}
		}
		else
		{
			inputRef.current.value = '';
		}
		
	},[updatePostDetailCommentCount, useDispatch]);
	 
	return(
	
		<div className=" " >
			<Form onSubmit={handleCommentSubmit}>
				<InputGroup className={`  ${isFocused && 'commentInputfocused'}`}> 
					<Form.Control placeholder="Enter test ..." className="commentInput" name="commentInput" ref={inputRef}   onFocus={handleFocus} onBlur={handleBlur} id="Comment Input" reqired="true" autoComplete="off" />
					<span className="p-2">
						<Button type="submit" variant="dark" id="comment-send-button-addon2" title="Send "   disabled={isSubmitting}>	{isSubmitting ? <Spinner className="text-white" size="sm" /> : <BsSend />}</Button>
					</span>
				</InputGroup>
			</Form>
		</div>
	
	);
};

export default memo(PostCommentInput);
