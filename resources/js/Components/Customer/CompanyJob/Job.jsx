 
import  {  memo} from 'react';  
import {useSelector } from 'react-redux'; 
import Row from 'react-bootstrap/Row'; 
import Col from 'react-bootstrap/Col';  ;   
import { BsGeoAlt , BsBriefcase, BsExclamationCircle    } from 'react-icons/bs';
import PostDate from '../Post/PostDate'; 
import JobHeader from './JobHeader'; 
import JobSkillRequired from './JobSkillRequired'; 
import JobActions from './JobActions'; 
import JobCompanyAndUser from './JobCompanyAndUser';  
import JobApplicationCount from './JobApplicationCount';  
  
import handleImageError from '../../../CustomHook/handleImageError';
  
 
const Job = ({job, chatBox=false}) => { 
	   //console.log(job);
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
		<div className="sub_main_container  p-2 p-md-3 rounded   "
			style={{backgroundColor:job.is_expired && 'rgba(255,0,0,0.1)'}}
		>
			<JobHeader 
				title={job.title}
				user_id={job.user_id}
				job_id={job.id}
				chatBox={chatBox}
			/>
			
			<Row className="p-0 w-100 m-0  align-items-center">
				<Col  xs={12} md={8} className="p-0 m-0 " >
					<JobCompanyAndUser job_id={job.id} company={job.company} user={job.user || null}/>
					
					 
					
					
					<div className="job-meta  pb-2	   ">
						<div className={` ${job.work_from_home == true && 'fw-bold text-danger'}`} ><BsGeoAlt className="me-1" /> 
						{job.work_from_home == true ? 'Remote' : job.job_location}
						</div>
						<div><BsBriefcase className="me-1" /> 
						{job.employment_type == 'full_time' && 'Full Time'}
						{job.employment_type == 'part_time' && 'Part Time'}
						{job.employment_type == 'internship' && 'Internship'}
						{job.employment_type == 'contract' && 'Contract'}
						
						</div>
						<div> ${job.salary} / {formatPaymentType(job.payment_type)}</div>
						
						
						
						{
							loggedUserData.id == job.user_id && job.is_expired
							&&(
								<div className="text-danger  "> 
					
									<BsExclamationCircle  className="me-1" />
									 <strong> Expired</strong>
								</div>
							)	
						}
						
						
					</div> 
				 
				 	
				 
				 
					<JobSkillRequired skillRequired={job.skill_required} />
				</Col>
				
					<Col   md={4} className="d-flex   flex-wrap gap-2 align-items-center justify-content-md-end justify-content-start py-2 px-0 m-0">
						 {
								loggedUserData.id == job.user_id && !chatBox &&
								(
									  
									<JobApplicationCount job_id={job.id} totalApplications={job.applications_count} />

								)
						 }
						 {
							 loggedUserData.id != job.user_id && !chatBox &&
								(
									<JobActions 
									job_id={job.id}
									is_expired={job.is_expired}
									already_applied={job.already_applied} 
									attempts={job.attempts}  
									has_saved={job.has_saved} 
									applications={job.applications || []}
									/>
								)
							}
					
					</Col>
					
				
				
			</Row>
			
			 
			
			<PostDate  postDate={job.created_at_human_readable}/> 
	
		 
		</div>
	);
	
};

export default memo(Job);
