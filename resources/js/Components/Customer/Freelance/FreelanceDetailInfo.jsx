import {memo} from 'react';
import {useSelector } from 'react-redux';
import PostDate from '../Post/PostDate';  
import FreelancePaymentType  from './FreelancePaymentType';  

const FreelanceDetailInfo = ({ freelanceDetail }) => {
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	
  return (
    <div >
		
      
				{/*budget*/}
        <p className="m-0">
          <strong>Budget :-</strong> 
						<span  >${freelanceDetail.budget_min} - ${freelanceDetail.budget_max}</span>
						<small className=" ps-2 text-muted" >
							<FreelancePaymentType paymentType={freelanceDetail.payment_type} />
						</small>
        </p>
				
				{/*experience*/}
        <p className="m-0">
          <strong>Expirence level:-</strong>
					<span className="ps-2">
						{freelanceDetail.experience_level == 'beginner' && 'Beginner'}
						{freelanceDetail.experience_level == 'intermediate' && 'Intermediate'}
						{freelanceDetail.experience_level == 'expert' && 'Expert'}
					
					</span>					
           
        </p>
				
				{/*duration*/}
        <p className="m-0">
          <strong>Duration :-</strong>
          <span className="ps-2 ">
            { freelanceDetail.duration}
          </span>
        </p>
				
				{/*Deadline*/}
				<p className="m-0">
						<strong>Last day for bid :-</strong>
						<span className={`ps-2 ${freelanceDetail?.is_expired && 'text-danger'} `}> 
						{
							(freelanceDetail?.is_expired)
							?
								'Passed'
							:
								freelanceDetail?.deadline_human_readable
						} 
						
						</span>
				</p>
        
				 
				
         
      

      <PostDate postDate={freelanceDetail.created_at_human_readable} />
    </div>
  );
};

export default memo(FreelanceDetailInfo);
