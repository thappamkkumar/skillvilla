import {useEffect, useState, useCallback, useRef, memo }  from 'react';  
import { Outlet, useLocation, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from "react-redux"; 
  
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col'; 
import Spinner from 'react-bootstrap/Spinner'; 
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button'; 
    
import StoryDetailFile from '../../../Components/Customer/Stories/StoryDetailFile'; 
import StoryDetailReviewCount from '../../../Components/Customer/Stories/StoryDetailReviewCount'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import serverConnection from '../../../CustomHook/serverConnection'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

const StoryDetailPage = () => {
	const { storyId } = useParams(); 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
 	
	const navigate = useNavigate();
	
	// Local state 
   const [storyDetail, setStoryDetail] = useState(null);
   const [loading, setLoading] = useState(false);
   
	 
   
	//function for fetching data
	const apiCall = useCallback(async( )=>{ 
		try
		{
			if(authToken == null || storyId == null){return;}
			setLoading(true); 
			  
			//call the function fetch  data fron server
			let data = await serverConnection('/admin/story-detail', {storyId: storyId}, authToken);
			  
		   console.log(data);
			if(data != null && data.status == true )
			{
				setStoryDetail(data.storyDetail || null);
			}
			 
		}
		catch(error)
		{
			 console.log(error);
			
		}
		finally
		{
			setLoading(false);
		}
			
	},[  authToken, storyId]); 

	useEffect(() => { 
		  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [ authToken]);
	
	 
       

 
	//navigate to user  profile
	const handleNavigateToUserProfile= useCallback((id, userId)=>{
		//manageVisitedUrl(`/admin/user-profile/${userId}/${id}`, 'append');
		navigate(`/admin/user-profile/${userId}/${id}`);
	}, []);	  
	 
	 
	 
	if(loading)
	{
		return(
		<div className="text-center py-4">
			<Spinner animation="border" size="md" />
		</div>
		);
	}
	
	 
	if(storyDetail == null && !loading)
	{
		return(
		<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
			<p className="no_posts_message   ">
			Story is not found or deleted. </p>
		</div>
		);
	}
	 
  return (
		<>
			<PageSeo 
				title="Story Detail | Admin | SkillVilla"
				description="View and manage story details in the SkillVilla admin panel."
				keywords="admin story detail, SkillVilla, content moderation, user story"
			/>

			<Row className="mx-auto   w-100   px-2   px-sm-3 px-md-4 px-lg-5      ">
				<Col sm={12} xl={10} xxl={8} className="mx-auto   p-0  rounded   sub_main_container"> 
						
				  
					 
					{		storyDetail != null && !loading
							&&
							<>
								 
								<div className="overflow-hidden px-2 py-3">
									<div className=" w-100  h-auto d-flex     align-items-center">
										<div className="btn p-0 border-0 " onClick={()=>handleNavigateToUserProfile(storyDetail.user.id, storyDetail.user.userID)} > 
											
											<Image 
												src={storyDetail.user.customer.image || '/images/login_icon.png'} 
												className="profile_img"
												onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
												alt={`profile image of ${(storyDetail.user!= null)&& storyDetail.user.userID}, associated with post "${(storyDetail.user!= null)&& storyDetail.user.userID}"`}/> 
												
										</div>
										<div className="  p-0 border-0 ps-3  " style={{overflow:'hidden'}} >
											
											<Button variant="*" 
											className="border-0 fs-5 fw-bold p-0 postTruncate"
											id={`userProfileNavigationBtn${storyDetail.id}${(storyDetail.user!= null)&& storyDetail.user.userID}`}
											title={`Go to user profile of ${(storyDetail.user!= null)&& storyDetail.user.userID}`} 
											onClick={()=>handleNavigateToUserProfile(storyDetail.user.id, storyDetail.user.userID)}>
												{(storyDetail.user!= null)&& storyDetail.user.userID}
											</Button> 
											<small>{storyDetail.created_at}</small>
										</div> 
										
									</div>
								</div>
				
				
								<StoryDetailFile 
								storyId={storyDetail.id}
								file={storyDetail.story_file} 
								type={storyDetail.story_file_type} 
								/> 
								<StoryDetailReviewCount
								likeCount={storyDetail.likes_count}
								commentCount={storyDetail.comments_count}
								/>
								
							</>
							
						 
				 }	
					
					
					
				</Col>
				
			
			</Row>
		
		</>	  
  );
};

export default memo(StoryDetailPage);
