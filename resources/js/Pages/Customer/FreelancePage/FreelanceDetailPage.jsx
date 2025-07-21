 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams } from 'react-router-dom';  
import {useSelector, useDispatch } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 
import  Row  from 'react-bootstrap/Row'; 
import  Col  from 'react-bootstrap/Col';  
 
import FreelanceHeader from '../../../Components/Customer/Freelance/FreelanceHeader';
import ReviewHirer from '../../../Components/Customer/FreelanceReview/ReviewHirer';
import FreelanceHirerAndRating from '../../../Components/Customer/Freelance/FreelanceHirerAndRating';
import FreelanceActions from '../../../Components/Customer/Freelance/FreelanceActions';
import FreelanceBidsCount from '../../../Components/Customer/Freelance/FreelanceBidsCount';
import FreelanceDetailInfo from '../../../Components/Customer/Freelance/FreelanceDetailInfo';
import UserBidOnFreelance from '../../../Components/Customer/Freelance/UserBidOnFreelance';
import JobSkillRequired from '../../../Components/Customer/CompanyJob/JobSkillRequired';
import Share from '../../../Components/Customer/Share/Share'; 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import LargeText from '../../../Components/Common/LargeText';

import AddFreelanceBid from '../../../Components/Customer/AddFreelanceBids/AddFreelanceBid';

import serverConnection from '../../../CustomHook/serverConnection';  

import useFreelanceDeleteWebsocket from '../../../Websockets/Freelance/useFreelanceDeleteWebsocket'; 
import useFreelanceBidCountWebsocket from '../../../Websockets/Freelance/useFreelanceBidCountWebsocket'; 

 
 

const FreelanceDetailPage = () => { 
	const { freelance_id } = useParams(); // get job_id from URL parameter
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [freelanceDetail, setFreelanceDetail] = useState(null);
	const [loading, setLoading] = useState(false);
	 
	 
	// Call the   hook for websockets event listeners
  useFreelanceDeleteWebsocket( loggedUserData,freelance_id,setFreelanceDetail);
  useFreelanceBidCountWebsocket( loggedUserData,freelance_id,setFreelanceDetail);
		
	 
	const updateFreelanceDetailSave = useCallback((savedFreelanceData)=>{
	 setFreelanceDetail((pre)=>({...pre,has_saved:savedFreelanceData.has_saved}));
	},[]);
	
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
			 
			  //  console.log(data);
			 
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
	
	 
	 
 	 
	 
	 
	return ( 
		<>
			<PageSeo 
				title={freelanceDetail?.title ? `${freelanceDetail.title} | Gig Detail | SkillVilla` : 'Freelance Gig Detail | SkillVilla'}
				description={freelanceDetail?.title ? `Explore the gig "${freelanceDetail.title}" on SkillVilla.` : 'View detailed freelance gigs on SkillVilla.'}
				keywords={freelanceDetail?.title ? `gig detail, ${freelanceDetail.title}, SkillVilla, freelance work` : 'gig detail, SkillVilla, freelance opportunity'}
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
												
												{/*freelance header component*/}
												<FreelanceHeader 
													 title = {freelanceDetail.title}
													 user_id = {freelanceDetail.user_id}
													 freelance_id = {freelanceDetail.id}
													detail = {true}
													setFreelanceDetail = {setFreelanceDetail}
												/> 
												
												{/*freelance hirer and rating component*/}
												<FreelanceHirerAndRating 
														freelance_id ={freelanceDetail.id}
														user ={freelanceDetail.user}
													/>
												
												{
													loggedUserData.id == freelanceDetail.user_id
													?(
														//freelance bid count and navigate to bids list component if owner of freelance is logged user 
														<div className="d-flex   flex-wrap gap-2 align-items-center justify-content-end   py-2 px-0 m-0">
												
															<FreelanceBidsCount 
																freelance_id={freelanceDetail.id}
																totalBids={freelanceDetail.bids_count}
															/>
														</div>
													)	
													:
													(
														//action button  like save 
														<div className="d-flex   flex-wrap gap-2 align-items-center justify-content-md-end justify-content-center py-4 py-md-2 px-0 m-0">
												
															<FreelanceActions 
															 freelance_id={freelanceDetail.id}
																is_expired={freelanceDetail.is_expired}
																already_bid={freelanceDetail.already_bid}  
																has_saved={freelanceDetail.has_saved}  
																bids={freelanceDetail.bids}
																updateFreelanceDetailSave = {updateFreelanceDetailSave}
															/>
														</div>
													)
												}
												 
												
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
												 
											
												{/*component for display logged user bid on freelacnce if the already placed*/}
												{
													freelanceDetail.already_bid && loggedUserData.id != freelanceDetail.user_id &&
													(
														<>
															<hr className="border-2  my-5   border-secondary" />
															<div>
																<h4  >Your bid on this project</h4>
																<UserBidOnFreelance 
																	bids={freelanceDetail.bids[0] || null}
																/>
															</div>
															
														</>
													)
												}
												
												
												
											
											</div>	
											
											{/*component for plcae or add bid on freelance*/}
											{
												!freelanceDetail.already_bid && loggedUserData.id != freelanceDetail.user_id && freelanceDetail.is_expired != true &&
												(
													<AddFreelanceBid
														freelance_id={freelanceDetail.id}  
														setFreelanceDetail={setFreelanceDetail}
													/>
												)
											}
											
											
											{/*Review the hirer*/}
												{
													freelanceDetail.already_bid && loggedUserData.id != freelanceDetail.user_id && freelanceDetail.bids[0].status === 'accepted' &&
													(
														 
																 
														 <ReviewHirer  
															hirer_id={freelanceDetail.user_id}
															setFreelanceDetail={setFreelanceDetail}
														 />
															 
													)
												}	 
											 
										</div> 
					 
											
										
								
										 
									):
									(
										<p className="no_posts_message">This freelance work is no longer available.</p>
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

export default memo(FreelanceDetailPage);
