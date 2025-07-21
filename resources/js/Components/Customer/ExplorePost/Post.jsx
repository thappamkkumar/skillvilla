 
import  {useState, useEffect, memo, useMemo, useCallback } from 'react';
import PostAttachment from './PostAttachment';
import PostAction from '../Post/PostAction';
import {useNavigate } from 'react-router-dom'; 

import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 import changeNumberIntoHumanReadableForm from '../../../CustomHook/changeNumberIntoHumanReadableForm'; 

const Post = ({post}) => {
 const navigate = useNavigate(); //geting reference of useNavigate into navigate
	 	
   	//state to store Likes and Comment human readable or better form
	const [postCountData, setPostCountData] = useState({}); 

	 
	useEffect(()=>{ 
	  
		//convert total likes into human readable Form
		let likes = changeNumberIntoHumanReadableForm(post.likes_count);
		//convert total comments into human readable Form
		let comments = changeNumberIntoHumanReadableForm(post.comments_count);
		setPostCountData({totalLikes:likes, totalComments:comments});
		
		 
		 
		
	}, [post]);
	
	
	
	
	const navigateToPostDetail = useCallback(() =>
	{  
		//call function to add current url into array of visited url
		manageVisitedUrl(`/post-detail/${post.id}`, 'append');
		navigate(`/post-detail/${post.id}`); 
	}, [post]);
	
	//stop navigation to detail when click on action button container
	const stopNavigation = useCallback((event) =>
	{  
		 // Prevent event propagation to the parent
    event.stopPropagation();
	}, [ ]);
	 
	
	
	return ( 
		<div className="explorePost RelativeContainer  "  onClick={navigateToPostDetail}>
			<PostAttachment  postID={post.id} attachment={post.attachment}   />
			<div className="explorePostActionContainer rounded" >
				<div className="explorePostAction px-2" onClick={stopNavigation} > 
					<PostAction postID={post.id} postCountData={postCountData} userLiked={post.has_liked}  userSaved={post.has_saved} />
				 
				</div>
			</div>
		</div> 
		 
	);
	
};

export default memo(Post);
