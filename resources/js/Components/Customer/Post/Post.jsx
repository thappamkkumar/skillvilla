 
import  {useState, useEffect, memo, useMemo } from 'react';
import {useSelector } from 'react-redux';
import PostHeader from './PostHeader';
import PostAttachment from './PostAttachment';
import PostAction from './PostAction';
//import PostTags from './PostTags';
import PostDate from './PostDate'; 
 
 import changeNumberIntoHumanReadableForm from '../../../CustomHook/changeNumberIntoHumanReadableForm'; 
 
const Post = ({post, chatBox=false}) => { 
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	 
	 //state to store Likes and Comment human readable or better form
	const [postCountData, setPostCountData] = useState({});  
	 
	 
	useEffect(()=>{ 
		 
		//convert total likes into human readable Form
		let likes = changeNumberIntoHumanReadableForm(post.likes_count);
		//convert total comments into human readable Form
		let comments = changeNumberIntoHumanReadableForm(post.comments_count);
		setPostCountData({totalLikes:likes, totalComments:comments});
		 
		 
	}, [post]);
	
	return ( 
		<div className="  rounded      post ">
		
			<PostHeader userProfile={post?.user?.customer?.image || null} userID={post.user.userID} ID={post.user.id} style={"profile_img"} postID={post.id} userName={post.user.name}  chatBox={chatBox} />
			
			<PostAttachment  postID={post.id} attachment={post.attachment}   />
			
			{
				!chatBox &&	
				<div className="px-3 pt-2">
					<PostAction postID={post.id} postCountData={postCountData} userLiked={post.has_liked}  userSaved={post.has_saved}   />
				</div>
			}
			
			<hr className="mb-2 mt-0"/>
			<div className="px-3 pb-2">
			{/*	
			{post.tags.length > 0 && <PostTags postID={post.id} tags={post.tags}  total={3} />}
			*/}
			<PostDate  postDate={post.created_at_human_readable}/> 
		
		 
			</div>
		</div>
	);
	
};

export default memo(Post);
