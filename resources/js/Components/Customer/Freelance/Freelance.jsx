 
import  {  memo} from 'react';  
import {useSelector } from 'react-redux'; 
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col';  ;    

import {  BsExclamationCircle  } from 'react-icons/bs'; 

import PostDate from '../Post/PostDate';  
import JobSkillRequired from '../CompanyJob/JobSkillRequired';  
import FreelanceHeader from './FreelanceHeader';  
import FreelanceHirerAndRating from './FreelanceHirerAndRating';  
import FreelancePaymentType  from './FreelancePaymentType';  
import FreelanceBidsCount  from './FreelanceBidsCount';  
import FreelanceActions  from './FreelanceActions';  
  
import handleImageError from '../../../CustomHook/handleImageError';
  
 
const Freelance = ({freelance, chatBox = false}) => { 
	   //console.log(job);
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	
	
	


	return ( 
		<div className=" sub_main_container w-100   p-2 p-md-3  rounded   " style={{backgroundColor:freelance.is_expired && 'rgba(255,0,0,0.1)'}} >
			<FreelanceHeader 
				 title = {freelance.title}
				 user_id = {freelance.user_id}
				 freelance_id = {freelance.id}
				 chatBox = {chatBox}
				  
			/>
			
			<Row className="p-0 w-100 m-0  align-items-center">
				<Col  xs={12} md={8} className="p-0 m-0 " >
					<FreelanceHirerAndRating 
						freelance_id ={freelance.id}
						user ={freelance.user}
					/>
					
					
				<div className="d-flex flex-wrap align-items-end pb-2  "> 
					<span  >${freelance.budget_min} - ${freelance.budget_max}</span>
					<small className=" ps-2 text-muted" >
						<FreelancePaymentType paymentType={freelance.payment_type} />
					</small>
					{
						loggedUserData.id == freelance.user_id &&  freelance.is_expired
						&&(
							<span className="text-danger ps-3 d-flex  align-items-center "> 
				
								<BsExclamationCircle  className="me-2" />
								 <strong> Deadline Passed  </strong>
							</span>
						)	
					}
				</div>

					
					<JobSkillRequired skillRequired={freelance.skill_required} />
				</Col>
				
					<Col   md={4} className="d-flex   flex-wrap gap-2 align-items-center justify-content-md-end justify-content-start pb-2 pt-3 px-0 m-0">
						  
							{
								loggedUserData.id == freelance.user_id && !chatBox &&
								(						  
									<FreelanceBidsCount 
										freelance_id={freelance.id}
										totalBids={freelance.bids_count}
									/>

								)	
							}
							
							{
								loggedUserData.id != freelance.user_id && !chatBox &&
								 
								(
									<FreelanceActions 
									 freelance_id={freelance.id}
										is_expired={freelance.is_expired}
										already_bid={freelance.already_bid}  
										has_saved={freelance.has_saved}  
										 
									/>
								)
							}
								
							 
							 
					
					</Col>
					
				
				
			</Row>
			
			 
			
			<PostDate  postDate={freelance.created_at_human_readable}/> 
	
		 
		</div>
	);
	
};

export default memo(Freelance);
