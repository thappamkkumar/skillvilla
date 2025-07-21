 
import  {useCallback, memo, useState} from 'react';  

import Button from 'react-bootstrap/Button';
import JobApplicationHeader from '../CompanyJobApplication/JobApplicationHeader'; 
import UpdateFreelanceBidStatus from './UpdateFreelanceBidStatus'; 
import PostDate from '../Post/PostDate';
import ReviewFreelancer from '../FreelanceReview/ReviewFreelancer';
import LargeText from '../../Common/LargeText';
import RatingStars from '../../Common/RatingStars';

 

 
const FreelanceBid = ({freelanceBid}) => { 
	  
	const [openReviewBox, setOpenReviewBox] = useState(false);
	
	 
	
	return ( 
		<div className="    sub_main_container  p-2 p-md-3 rounded mb-2    " >
		 
			<JobApplicationHeader user={freelanceBid.user}/>
			  
			<div className="pt-3 d-flex gap-2 align-items-center">
				<RatingStars rating={freelanceBid.user.avg_rating || 0} small={true} />
				<small className="px-2 py-1   rounded-1 tech_skill">{freelanceBid.user.review_count || 0} reviews</small>
				{
					freelanceBid.status === 'accepted' &&
					<Button variant="danger"  
					title={`Share something about freelancer ${freelanceBid.user.userID}.`}
					id={`reviewRate${freelanceBid.user.userID}`}
					size="sm"
					onClick={() => setOpenReviewBox(prev => !prev)}

					>
						Review the freelancer
					</Button>
				}
			</div>
			 
		 {openReviewBox &&
			<ReviewFreelancer freelancer_id={freelanceBid.user.id} setOpenReviewBox={setOpenReviewBox} openReviewBox={openReviewBox}  />
			}
			<div className="px-2 ">
				<div className=" pt-3 ">
					{/*cover letter*/}
					<strong>Cover Letter </strong>
					<div className="px-1 "> 
						<LargeText largeText={freelanceBid.cover_letter} />
							 
					</div>
				</div>
				
				<div className="pt-2   ">
				 {/*amount or payment*/}
					<p className="m-0">
						<strong>Amount :-</strong>
						<span className="ps-2 ">
						 ${ freelanceBid.bid_amount}  
						</span>
						
						<span className="px-2">
						/
						</span>
						
						<span className=" ">
							{freelanceBid.payment_type == 'hourly' && 'Hourly'}
							{freelanceBid.payment_type == 'fixed' && 'Fixed'}
							{freelanceBid.payment_type == 'negotiable' && 'Negotiable'}
						
						</span>
					</p>
				
					{/*delivery time*/}
					<p className="m-0">
						<strong>Delivery Time :-</strong>
						<span className="ps-2 ">
							{ freelanceBid.delivery_time}
						</span>
					</p>
				</div>
				<div className=" d-flex flex-wrap align-items-center  gap-4">
					<p  className="p-0 m-0">
						<strong>Status:</strong>
						<strong
							className={`ps-2   
								${freelanceBid.status === 'accepted' && 'text-success'}
								${freelanceBid.status === 'submitted' && 'text-primary'}
								${freelanceBid.status === 'in_review' && 'text-warning'}
								${freelanceBid.status === 'shortlisted' && 'text-info'}
								${freelanceBid.status === 'rejected' && 'text-danger'}
							`}
						> 
							{freelanceBid.status === 'accepted' && ' Accepted'}
							{freelanceBid.status === 'submitted' && ' Submitted'}
							{freelanceBid.status === 'in_review' && ' In Review'}
							{freelanceBid.status === 'shortlisted' && ' Shortlisted'}
							{freelanceBid.status === 'rejected' && ' Rejected'}
						</strong>

						 
					</p>
					<UpdateFreelanceBidStatus
						bidId={freelanceBid.id}
						bidStatus={freelanceBid.status} 
					/>
				</div> 
				
				 
					
				
				
				<PostDate  postDate={freelanceBid.created_at_human_readable}/> 
		
			</div>
			
			
		</div>
	);
	
};

export default memo(FreelanceBid);
