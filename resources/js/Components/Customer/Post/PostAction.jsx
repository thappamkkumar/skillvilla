 
import React, {useEffect, useCallback, memo} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import { updateCommentState } from '../../../StoreWrapper/Slice/CommentSlice'; 

import { updatePostState } from '../../../StoreWrapper/Slice/PostSlice';
import { updatePostState as updateUserPostState } from '../../../StoreWrapper/Slice/UserPostSlice';
import { updatePostState as updateTaggedSavedPostState } from '../../../StoreWrapper/Slice/TaggedSavedPostSlice';
import { updatePostState as updateMyPostState } from '../../../StoreWrapper/Slice/MyPostSlice'; 
import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice';


import Row from 'react-bootstrap/Row';    
import Col from 'react-bootstrap/Col';    
import Button from 'react-bootstrap/Button';      
import {BsHeart, BsHeartFill, BsChat,    BsBookmarkPlus, BsBookmark, BsShare  } from 'react-icons/bs'; 

import serverConnection from '../../../CustomHook/serverConnection';


const PostAction= ({postID, postCountData, userLiked, userSaved,  updatePostDetailLike = ()=>{}, updatePostDetailSave = ()=>{}, }) => {
	
	 const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	//function use to update redux state for showing comment box
	const handleComment = useCallback(()=>{ 
		dispatch(updateCommentState({type : 'SetPostID', postID: postID}));
		dispatch(updateCommentState({type : 'SetCommentStatus', commentStatus: true}));
	}, []);
	
	//function use to call custom hook or function to like the post or remove like
	const handlePostLike = useCallback(async()=>{
			let data = {
			
			post_id:postID,  
		}; 
		let result = await serverConnection(`/like-post`, data, authToken);
		// console.log(result);
		if(result.status == true)
		{
			updatePostDetailLike(result.datalike);
			dispatch(updatePostState({type : 'updatePostLike', newLike: result.datalike}));
			dispatch(updateUserPostState({type : 'updatePostLike', newLike: result.datalike}));
			dispatch(updateTaggedSavedPostState({type : 'updatePostLike', newLike: result.datalike}));
			dispatch(updateMyPostState({type : 'updatePostLike', newLike: result.datalike}));
			dispatch(updateFeedState({type : 'updateFeedPostLike', postLike: {
					'post_likes_count': result.datalike.likes_count,
					'post_like_status': result.datalike.status,
					'post_feed_id':result.datalike.post_id,
					'post_feed_type':'post',
			} }));  
			
		}
	}, []);
	
	
	//function use to call custom hook or function to save post the post or remove save post
	const handlePostSave = useCallback(async()=>{
			let data = {
			
			post_id:postID,  
		}; 
		let result = await serverConnection(`/save-post`, data, authToken);
		//console.log(result);
		if(result.status == true)
		{
			updatePostDetailSave(result.savePostData);
			dispatch(updatePostState({type : 'updatePostSaves', savedData: result.savePostData}));
			dispatch(updateUserPostState({type : 'updatePostSaves', savedData: result.savePostData}));
			dispatch(updateTaggedSavedPostState({type : 'updatePostSaves', savedData: result.savePostData}));
			dispatch(updateMyPostState({type : 'updatePostSaves', savedData: result.savePostData}));
			dispatch(updateFeedState({type : 'updateFeedSaves', savedData: {
					'has_saved': result.savePostData.status === 'saved',
					'feed_id':result.savePostData.post_id,
					'feed_type':'post',
			} })); 
		}
		 
	}, []);
	
	
	//function use to handle post share
	const handlePostShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: postID}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "post"})); 
	}, [postID]);
	
	return ( 
		<div className="w-100 h-auto  py-2    ">
			<div className=" d-flex   flex-wrap justify-content-between  align-items-center    ">
				 <div className=" d-flex   flex-wrap gap-3">
					
					<div className="d-flex gap-2 align-items-center">
						
						<Button variant="*"  onClick={handlePostLike}  className={` p-0 lh-1    fw-bold border-0 postBTN ${userLiked && 'postLiked'} `} id={`likeButton${postID}`}  title="Like" > {userLiked ? <BsHeartFill   /> : <BsHeart />}</Button>
						
						<span>{postCountData.totalLikes}</span>
						
					</div>
					<div className="d-flex gap-2 align-items-center">
						
						<Button variant="*"   className={`p-0  lh-1   fw-bold border-0 postBTN `}  id={`commentButton${postID}`} title="Comment " onClick={handleComment} >  <BsChat /></Button>
						
						<span>{postCountData.totalComments}</span>
						
					</div>
					 
					<Button variant="*"   className={`p-0  lh-1   fw-bold border-0 postBTN `}  id={`sharePostButton${postID}`} title="Share post " onClick={handlePostShare} >  <BsShare /></Button>
					
					
				 </div>
				 <div>
						<Button variant="*"  onClick={handlePostSave}   className={`p-0 pb-1	  lh-1  fw-bold border-0 postBTN ${userSaved && 'postLiked'} `}   id={`saveButton${postID}`} title="Save for latter " >{userSaved ? <BsBookmark /> : <BsBookmarkPlus />}</Button>
					 
				</div>
					  
			</div> 
			{/*<div className="d-flex    flex-wrap justify-content-start px-0  py-1 text-secondary  ">
				 
					<small className="me-2">{postCountData.totalLikes} likes</small> 
				 
					<small  >{postCountData.totalComments} comments</small> 
				 
				
			</div>*/}
		</div>
	);
	
};

export default memo(PostAction);
