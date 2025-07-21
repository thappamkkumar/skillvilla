 
import  {  memo} from 'react';
 import JobApplicaiton from '../CompanyJobApplication/JobApplicaiton';     
 
const JobApplicationList = ({jobApplicaitonList}) => { 
	  
	  
	return ( 
		<div className=" py-3" >
			{jobApplicaitonList.map((jobApplication) => ( 
						
						<div key={jobApplication.id} className="  py-4 "  style={{  maxWidth:'100%',}}   >
							 
									<JobApplicaiton jobApplication={jobApplication}   />
								 
						</div>
					))} 
		</div>
	);
	
};

export default memo(JobApplicationList);
