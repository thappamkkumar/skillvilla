import {memo} from 'react';
import {useSelector } from 'react-redux'; 
import PostDate from '../Post/PostDate'; 

const JobDetailInfo = ({ jobDetail }) => {
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	
	const formatPaymentType = (type) => {
  const types = { 
    hourly: 'hour',
    daily: 'day',
    monthly: 'month',
    yearly: 'year',
    
  };
  return types[type] || 'Unknown';
};
  return (
    <div>
      <div>
        <p className="m-0">
          <strong>Salary :-</strong> <span className="ps-2">${jobDetail.salary} / { formatPaymentType(jobDetail.payment_type)}</span>
        </p>
        <p className="m-0">
          <strong>Location :-</strong>
          <span className={`ps-2 ${jobDetail.work_from_home && 'fw-bold text-danger'}`}>
            {jobDetail.work_from_home ? 'Remote' : jobDetail.job_location}
          </span>
        </p>
        <p className="m-0">
          <strong>Employment Type :-</strong> 
					<span className="ps-2">
						{jobDetail.employment_type == 'full_time' && 'Full Time'}
						{jobDetail.employment_type == 'part_time' && 'Part Time'}
						{jobDetail.employment_type == 'internship' && 'Internship'}
						{jobDetail.employment_type == 'contract' && 'Contract'}
					
					</span>
        </p>
        <p className="m-0">
          <strong>Communication Language :-</strong>
          <span className="ps-2">{jobDetail.communication_language}</span>
        </p>
				
				{/*Expiration Date*/}
				<p className="m-0">
						<strong>Expiration Date:-</strong>
						<span className={`ps-2 ${jobDetail?.is_expired && 'text-danger'} `}> 
						{
							(jobDetail?.is_expired)
							?
								'Expired'
							:
								jobDetail?.expires_at_human_readable
						} 
						
						</span>
				</p>
				
				
          
        
      </div>

      

      <PostDate postDate={jobDetail.created_at_human_readable} />
    </div>
  );
};

export default memo(JobDetailInfo);
