 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams , useNavigate} from 'react-router-dom';  
import {useSelector   } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 
 import  Image  from 'react-bootstrap/Image';  

 import FreelanceDetailInfo from '../../../Components/Customer/Freelance/FreelanceDetailInfo';
import UserBidOnFreelance from '../../../Components/Customer/Freelance/UserBidOnFreelance';
import JobSkillRequired from '../../../Components/Customer/CompanyJob/JobSkillRequired';
 
import LargeText from '../../../Components/Common/LargeText';
import RatingStars from '../../../Components/Common/RatingStars';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
 
import serverConnection from '../../../CustomHook/serverConnection';  
import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 
 
 

const FreelanceDetailPage = () => { 
	const { freelance_id } = useParams(); // get job_id from URL parameter
	 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [freelanceDetail, setFreelanceDetail] = useState(null);
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate(); 
	   
	
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			setLoading(true);
			if(freelance_id == null || authToken==null)
			{
				return;
			}
			let requestData = {freelance_id: freelance_id, } ;
			let url = `/get-freelance-work-detail`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			  // console.log(data);
			 
			 if(data != null && data.freelanceDetail != null )
			 {     
					setFreelanceDetail(data.freelanceDetail)
					 
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
		//	manageVisitedUrl(`/admin/user-profile/${freelanceDetail.user.userID}/${freelanceDetail.user.id}`, 'append');
		navigate(`/admin/user-profile/${freelanceDetail.user.userID}/${freelanceDetail.user.id}`);
	},[freelanceDetail ]); 
	 
	 
	return ( 
		<>
			<PageSeo 
				title={freelanceDetail?.title ? `${freelanceDetail.title} | Admin | SkillVilla` : 'Freelance Gig Detail | Admin | SkillVilla'}
				description={freelanceDetail?.title ? `Admin view of the freelance gig titled "${freelanceDetail.title}" on SkillVilla.` : 'View and manage freelance gig details from the admin panel.'}
				keywords={freelanceDetail?.title ? `admin freelance, ${freelanceDetail.title}, SkillVilla, freelance gig` : 'admin freelance, SkillVilla, freelance detail, gig moderation'}
			/>

			<div   className="pt-2 pt-md-4 pb-5 px-0 px-md-4 px-lg-5 main_container  " id="mainScrollableDiv"> 
				
				 
				{
					loading ?
						(
							<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
						):(
							<div className="">
								{
									(freelanceDetail != null) ?
									(
										<div className="pt-3  pt-md-3 pt-lg-4 overflow-hidden  mx-auto rounded sub_main_container ">
											<div className=" px-2  px-md-3 px-lg-4 pb-5  ">
												 
												{/*Title*/}
												<h2  className="fw-bold p-0 text-break">{freelanceDetail.title} </h2>
												
												{/*freelance hirer and rating  */}
												<div className="d-flex align-items-center flex-wrap gap-2  pt-1 pb-3">
													 
													<div 
														className="d-flex align-items-center  "
														onClick={handleNavigateToProfile}
														style={{cursor:'pointer'}}
													> 
													
														<Image
															src={freelanceDetail?.user?.customer?.image || '/images/login_icon.png'}
															className="comment_profile_image"
															onError={(event) => handleImageError(event, '/images/login_icon.png')}
															alt={`profile image of ${freelanceDetail.user.name}`}
															 
														/>
														<span
															 
															title={`View profile of ${freelanceDetail.user.userID}`}
															className="p-0 px-2 text-decoration-underline post_tags" 
														>
															{freelanceDetail.user.userID}
														</span>
														
													</div>
				
													<span className="text-secondary   fs-5">|</span>
						 
													<div className="d-flex align-items-center     ">
														<RatingStars rating={freelanceDetail.user.hirer_review_stats.avg_rating || 0} small={true} />
														 <small className="py-1 px-2 rounded-1   ms-2   skill  "  >{freelanceDetail.user.hirer_review_stats.review_count || 0} reviews </small>
													</div>
												
												</div>
												  
												
												{/*freelance detail basic info component*/}
												<FreelanceDetailInfo 
													freelanceDetail={freelanceDetail}
												/>
												  
												 
												<hr className="border-2  my-5   border-secondary" />
												
												 
												{/*freelance skill required component*/}
												<>
														<h4  >Required skills </h4>
													<JobSkillRequired skillRequired={freelanceDetail.skill_required} />
												</>
												 
												<hr className="border-2  my-5   border-secondary" />
												
												
												{/*freelance skill required component*/}
												<div>
													<h4>Description</h4>
													<LargeText largeText={freelanceDetail.description} />
												</div>
												  
											</div>	
											 
											 
										</div> 
					  
									):
									(
										<p className="no_posts_message">This freelance work is no longer available.</p>
									)		
								}
							</div>
						)
						
				}	 
			  
			</div>
		</>
	);
};

export default memo(FreelanceDetailPage);
