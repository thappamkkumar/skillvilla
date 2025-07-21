import   {memo,useMemo, useCallback, useEffect, useState }   from 'react';
import { useSelector, useDispatch } from 'react-redux'; 
import { useParams } from 'react-router-dom';
   
import Button from 'react-bootstrap/Button';  
import Spinner from 'react-bootstrap/Spinner';  
import Row from 'react-bootstrap/Row';  
import Col from 'react-bootstrap/Col';  
  
import PostHeader from '../../../Components/Customer/Post/PostHeader'; 
import PostAction from '../../../Components/Customer/Post/PostAction';
import PostTags from '../../../Components/Customer/Post/PostTags';
import PostDate from '../../../Components/Customer/Post/PostDate'; 
import PostDetailAttachmentList from '../../../Components/Customer/PostDetail/PostDetailAttachmentList';
import PostDetailCategory from '../../../Components/Customer/PostDetail/PostDetailCategory';
import PostComments from '../../../Components/Customer/PostComment/PostComments'; 
import LargeText from '../../../Components/Common/LargeText';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


import changeNumberIntoHumanReadableForm from '../../../CustomHook/changeNumberIntoHumanReadableForm'; 
import serverConnection from '../../../CustomHook/serverConnection';
 

import usePostLikeWebsocket from '../../../Websockets/Post/usePostLikeWebsocket'; 
import usePostCommentCountWebsocket from '../../../Websockets/Post/usePostCommentCountWebsocket'; 
import usePostDeleteWebsocket from '../../../Websockets/Post/usePostDeleteWebsocket'; 

 
 
const PostDetailPage = () =>
{
	const { postId } = useParams();//get id from parameter of url
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const commentStatus = useSelector((state) => state.commentList.commentStatus); 
	const [postDetail, setPostDetail] = useState(null);//state use to store post Detail
	const [loading, setLoading] = useState(true);
 	//state to store Likes and Comment human readable or better form
	const [postCountData, setPostCountData] = useState({}); 
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	//update post detail like count and like status
	const updatePostDetailLikeCount = useCallback((newLike)=>
	{
		setPostDetail((prevPostDetail) => ({
					...prevPostDetail, 
					likes_count: newLike.likes_count,  
			}));
	},[]);
	const updatePostDetailLike = useCallback((newLike)=>
	{
		setPostDetail((prevPostDetail) => ({
					...prevPostDetail,
					has_liked: newLike.status,
					likes_count: newLike.likes_count,  
			}));
			 
	},[]);
	//update post detail like count and like status
	const updatePostDetailSave = useCallback((savedData)=>
	{ 
		setPostDetail((prevPostDetail) => ({
				...prevPostDetail,
				has_saved: savedData.status === 'saved',
		}));
	},[]);
	
//update post detail comment count  
	const updatePostDetailCommentCount = useCallback((commentData)=>
	{  
		setPostDetail((prevPost) => ({
				...prevPost,
				comments_count: commentData.comments_count,
		}));
	},[]);
 
// Call the usePostDetailWebsockets hook for websockets event listeners
    
	usePostLikeWebsocket(loggedUserData, postId, updatePostDetailLikeCount);
	usePostCommentCountWebsocket(loggedUserData, postId, updatePostDetailCommentCount);
	usePostDeleteWebsocket(loggedUserData, postId, setPostDetail);

	




	//useEffect hook for calling function that return data from server 
	useEffect(()=>{
		const apiCall = async()=>{
			
			try
			{
				if( authToken == null || postId == null) return;
				setLoading(true);
				//call the function fetcg post data fron server
				let data = await serverConnection(`/get-post-detail`, {postId: postId }, authToken);
				  //console.log(data);
				 setPostDetail(data.postDetail || null);
				setLoading(false);
			}
			catch(error)
			{
				console.log(error);
				setLoading(false);
			}
		}	
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, postId]);
	
	
	 
	const totalPostAttachment = useMemo(()=>{ if(postDetail != null ) { return postDetail.attachment.length; } else { return 0;}}, [postDetail]);
	
	useEffect(()=>{ 
	 
		if(postDetail != null)
		{		   
			 
			//convert total likes into human readable Form
			let likes = changeNumberIntoHumanReadableForm(postDetail.likes_count);
			//convert total comments into human readable Form
			let comments = changeNumberIntoHumanReadableForm(postDetail.comments_count);
			setPostCountData({totalLikes:likes, totalComments:comments});
			 
		
		}
	}, [postDetail]);
	
	
	

  return (
		<>
			<PageSeo 
				title="Post Detail | SkillVilla"
				description="View detailed content shared by professionals on SkillVilla."
				keywords="post detail, SkillVilla, user content, shared post"
			/>


			<div className=" main_container py-4 px-2    ">
			{
				loading && postDetail == null ? 
				(
					<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
				)
				:
				(
						postDetail == null ?(
							<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
							<p className="no_posts_message">This post is no longer available.</p>
							</div>
						): (
								<Row className="mx-auto   w-100   px-2   px-sm-3 px-md-4 px-lg-5      ">
									<Col sm={12} xl={10} xxl={8} className="mx-auto   p-0 rounded   sub_main_container">
										 <PostHeader userProfile={postDetail?.user?.customer?.image} userID={postDetail.user.userID} ID={postDetail.user.id} style={"profile_img"} postID={postDetail.id} userName={postDetail.user.name} detail={true} setPostDetail={setPostDetail} /> 
												
											
											<PostDetailAttachmentList postAttachments={postDetail.attachment} />
											
											
											<div className="px-3 py-2">
											
												<PostAction postID={postDetail.id} postCountData={postCountData} userLiked={postDetail.has_liked} userSaved={postDetail.has_saved} updatePostDetailLike={updatePostDetailLike}  updatePostDetailSave={updatePostDetailSave} /> 
												
												<hr className="mb-2 mt-0"/>
												
												{postDetail.tags.length > 0 &&<PostTags postID={postDetail.id} tags={postDetail.tags} />}
												
												<div className="px-0 pt-4  ">
													<h4 className="pb-1">Categories</h4>
													<PostDetailCategory postID={postDetail.id} categories={postDetail.category} />
												</div>

												
												{/*description*/}
												{
													postDetail.description != null && postDetail.description != ''&&
													<div className="px-0 pt-4  ">
															<h4>Description</h4>
															<LargeText largeText={postDetail.description} />
													</div>
												}
												
												
												<PostDate postDate={postDetail.created_at_human_readable} />
										 
											</div>
										</Col>
								</Row>
						)
				)
			}
			 
				
				{
					!loading && commentStatus && <PostComments  updatePostDetailCommentCount={updatePostDetailCommentCount} />
				}
				
				{/*component for share post with user or community or copy link*/}
				<Share />
				
			</div>
		</>
  );
};

export default memo(PostDetailPage);
