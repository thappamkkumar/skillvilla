 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams, useNavigate } from 'react-router-dom';  
import {useSelector,   } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 
import  Image  from 'react-bootstrap/Image'; 

import RatingStars from '../../../Components/Common/RatingStars.jsx';
 
import WorkfolioUploadBy from '../../../Components/Customer/Workfolio/WorkfolioUploadBy.jsx';
import WorkfolioImages from '../../../Components/Customer/Workfolio/WorkfolioImages.jsx';
import WorkfolioVideo from '../../../Components/Customer/Workfolio/WorkfolioVideo.jsx';
import ProblemAttachment from '../../../Components/Customer/Problem/ProblemAttachment.jsx';
import WorkfolioReviews from '../../../Components/Customer/Workfolio/WorkfolioReviews.jsx';
import PostDate from '../../../Components/Customer/Post/PostDate'; 
import LargeText from '../../../Components/Common/LargeText';
import PostDetailTags from '../../../Components/Customer/PostDetail/PostDetailTags';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

    
 
import serverConnection from '../../../CustomHook/serverConnection'; 
import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 
const WorkFolioDetailPage = () => { 

	const { workfolio_id } = useParams(); // get id from URL parameter
	 const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [workfolioDetail, setWorkfolioDetail] = useState(null);
	 
	const [loading, setLoading] = useState(false);
	 const navigate = useNavigate(); 
	 
  

 
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			setLoading(true);
			if(workfolio_id == null || authToken == null)
			{
				return;
			}
			let requestData = {id: workfolio_id, } ;
			let url = `/get-workfolio-detail`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			//update the post state in redux.
			
				// console.log(data);
			 if(data.workfolioDetail != null )
			 {    
					setWorkfolioDetail(data.workfolioDetail)
			 } 
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[ authToken]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken]);
	
	 
 		//handle navigate to user profile
	const handleNavigateToProfile = useCallback(()=>
	{
		//	manageVisitedUrl(`/admin/user-profile/${workfolioDetail.user.userID}/${workfolioDetail.user.id}`, 'append');
		navigate(`/admin/user-profile/${workfolioDetail.user.userID}/${workfolioDetail.user.id}`);
	},[workfolioDetail ]);
	  
	 
	 
	return ( 
		<>
			<PageSeo 
			title={workfolioDetail?.title ? `${workfolioDetail.title} | Admin | SkillVilla` : 'Workfolio Detail | Admin | SkillVilla'}
			description={workfolioDetail?.title ? `Admin view of the workfolio titled "${workfolioDetail.title}" on SkillVilla.` : 'View and manage user workfolios in the admin panel.'}
			keywords={workfolioDetail?.title ? `admin workfolio, ${workfolioDetail.title}, SkillVilla, user portfolio` : 'admin workfolio, SkillVilla, portfolio detail, user content'}
		/>

			<div   className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container   " id="mainScrollableDiv"> 
				
				{
					loading ?
						(
							<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
						):(
							<div className=" ">
								{
									(workfolioDetail != null) ?
									(
										<div className="py-2  py-md-3 py-lg-4 rounded  sub_main_container ">		
											<div className="px-2  px-md-3 px-lg-4">
												
												{/*Title*/}
												<h2  className="fw-bold p-0 text-break">{workfolioDetail.title} </h2>
												
												
												<div className="d-flex align-items-center flex-wrap gap-2  py-1">
													 
													<div 
														className="d-flex align-items-center  "
														onClick={handleNavigateToProfile}
														style={{cursor:'pointer'}}
													> 
													
														<Image
															src={workfolioDetail?.user?.customer?.image || '/images/login_icon.png'}
															className="comment_profile_image"
															onError={(event) => handleImageError(event, '/images/login_icon.png')}
															alt={`profile image of ${workfolioDetail.user.name}`}
															 
														/>
														<span
															 
															title={`View profile of ${workfolioDetail.user.userID}`}
															className="p-0 px-2 text-decoration-underline post_tags" 
														>
															{workfolioDetail.user.userID}
														</span>
														
													</div>
				
													<span className="text-secondary   fs-5">|</span>
						 
													<div className="d-flex align-items-center     ">
														 <RatingStars rating={workfolioDetail.workfolio_review_avg_rating} small={true} />
														 <small className="py-1 px-2 rounded-1   ms-2   skill  "  >{workfolioDetail.workfolio_review_count} reviews </small>
													</div>
												
												</div>
												
												
											 
												
												{/*Upload date*/}
												<PostDate  postDate={workfolioDetail.created_at_formated}/> 
											</div>
											
											
											<hr className="border-2 my-5   border-secondary"/>
											
											<div className="px-2  px-md-3 px-lg-4  ">
														<h4 className="pb-1">Categories</h4>
														<PostDetailTags postID={workfolioDetail.id} tags={workfolioDetail.tags} />
													</div>
											
											<hr className="border-2 my-5   border-secondary"/>
											
											
											{/*description*/}
											<div className="px-2  px-md-3 px-lg-4  ">
														<h4>Description</h4>
														<LargeText largeText={workfolioDetail.description} />
											</div>
											 
											
											{/*Images*/}
											{workfolioDetail?.images?.length > 0 && (
												<>
													<hr className="border-2 my-5  border-secondary" />
													<div className="px-2  px-md-3 px-lg-4   ">
														<WorkfolioImages images={workfolioDetail.images} />
													</div>
												</>
											)}
												
											{/*video*/}
											{workfolioDetail?.video && (
												<>
													<hr className="border-2 my-5 border-secondary" />
													<div className="px-2  px-md-3 px-lg-4 ">
														<WorkfolioVideo videoName={workfolioDetail.video} />
													</div>
												</>
											)}
											{/*other files*/}
											{workfolioDetail?.other && (
												<>
													<hr className="border-2 my-5 border-secondary" />
													<div className="px-2  px-md-3 px-lg-4  ">
														<ProblemAttachment id={workfolioDetail.id} attachment={workfolioDetail.other}  heading={'Other'}  component={'workfolioOther'} />
													</div>
												</>
											)}

											
											 
											
											 
											 
								
										</div>
									):
									(
										<div className="    px-2   px-sm-3 px-md-4 px-lg-5  py-2  ">
										<p className="no_posts_message">This work is no longer available.</p>
										</div>
									)							
								}
								
							</div>
						)
						
				}	 
			 
				 
				
				 
				 
			</div>
		</>
	);
};

export default memo(WorkFolioDetailPage);
