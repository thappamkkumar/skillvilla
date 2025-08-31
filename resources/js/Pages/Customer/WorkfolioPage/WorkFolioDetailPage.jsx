 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams } from 'react-router-dom';  
import {useSelector, useDispatch } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 

import RatingStars from '../../../Components/Common/RatingStars.jsx';
import WorkfolioHeader from '../../../Components/Customer/Workfolio/WorkfolioHeader.jsx';
import WorkfolioUploadBy from '../../../Components/Customer/Workfolio/WorkfolioUploadBy.jsx';
import WorkfolioImages from '../../../Components/Customer/Workfolio/WorkfolioImages.jsx';
import WorkfolioVideo from '../../../Components/Customer/Workfolio/WorkfolioVideo.jsx';
import ProblemAttachment from '../../../Components/Customer/Problem/ProblemAttachment.jsx';
import WorkfolioReviews from '../../../Components/Customer/Workfolio/WorkfolioReviews.jsx';
import PostDate from '../../../Components/Customer/Post/PostDate'; 
import LargeText from '../../../Components/Common/LargeText';
import PostDetailTags from '../../../Components/Customer/PostDetail/PostDetailTags';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

    
 
import serverConnection from '../../../CustomHook/serverConnection'; 

import useWorkfolioAvgCountWebsocket from '../../../Websockets/Workfolio/useWorkfolioAvgCountWebsocket'; 
import useWorkfolioDeleteWebsocket from '../../../Websockets/Workfolio/useWorkfolioDeleteWebsocket'; 


//for real time updation of review visit WorkfolioReview component. websocket use in WorkfolioReview to add new review for other user


const WorkFolioDetailPage = () => { 

	const { workfolio_id } = useParams(); // get id from URL parameter
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [workfolioDetail, setWorkfolioDetail] = useState(null);
	 
	const [loading, setLoading] = useState(false);
	 const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	
	 
 
	
	//function to update rating avg and count
	const updateAvgAndCount = useCallback((avg, count)=>{
		setWorkfolioDetail((prevState) => ({
				...prevState, // Spread previous state to keep other properties
				workfolio_review_avg_rating: avg,
				workfolio_review_count: count
			}));
	},[]);
	
	/// Call the   hook for websockets event listeners 
	useWorkfolioAvgCountWebsocket(logedUserData, workfolio_id, setWorkfolioDetail);
	useWorkfolioDeleteWebsocket(logedUserData, workfolio_id, setWorkfolioDetail);
	
	 

 
	
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
	
	 
 	 
	 
	 
	return ( 
		<>
			<PageSeo 
			title={workfolioDetail?.title ? `${workfolioDetail.title} | Workfolio | SkillVilla` : 'Workfolio Detail | SkillVilla'}
			description={workfolioDetail?.title ? `Explore the workfolio titled "${workfolioDetail.title}" on SkillVilla.` : 'Explore detailed workfolios from professionals on SkillVilla.'}
			keywords={workfolioDetail?.title ? `workfolio detail, ${workfolioDetail.title}, SkillVilla, professional workfolio` : 'workfolio detail, SkillVilla, user content, shared workfolio'}
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
												<WorkfolioHeader
												title={workfolioDetail.title} 
												workfolio_id={workfolioDetail.id}
												user_id={workfolioDetail.user.id} 
												has_saved={workfolioDetail.has_saved} 
												detail={true} 
												setWorkfolioDetail={setWorkfolioDetail}  />
												
												
												<div className="d-flex align-items-center flex-wrap gap-2  py-1">
													<WorkfolioUploadBy 
													user={workfolioDetail.user}  
													/>
												
													<span className="text-secondary   fs-5">|</span>
						 
													<div className="d-flex align-items-center     ">
														 <RatingStars rating={workfolioDetail.workfolio_review_avg_rating} small={true} />
														 <small className="py-1 px-2 rounded-1   ms-2   skill  "  >{workfolioDetail.workfolio_review_count} reviews </small>
													</div>
												
												</div>
												
												
											 
												
												{/*Upload date*/}
												<PostDate  postDate={workfolioDetail.created_at_human_readable}/> 
											</div>
											
											
											<hr className="border-2 my-5   border-secondary"/>
											
											<div className="px-2  px-md-3 px-lg-4  ">
														<h4 className="pb-1">Tags</h4>
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

											
											 
											
											 
											{/*Reviews*/}
											<hr className="border-2  mt-5 mb-0  border-secondary"/>					
											<WorkfolioReviews workfolio_id={workfolioDetail.id} updateAvgAndCount={updateAvgAndCount} />
								
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
			 
				 
				{/*component for share post with user or community or copy link*/}
					<Share />
				 
				 
			</div>
		</>
	);
};

export default memo(WorkFolioDetailPage);
