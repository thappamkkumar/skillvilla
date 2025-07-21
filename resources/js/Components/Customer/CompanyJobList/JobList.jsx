 
import {memo} from 'react';  
 import Job from '../CompanyJob/Job'; 

const JobList = ({jobList }) => { 
	 
     
	return ( 
		 
			<div className="  px-0 py-3 px-sm-3 px-md-4 px-lg-5         "   >
				 
				{jobList.map((job) => ( 
						
						<div className=" mb-3    " key={job.id}    style={{  maxWidth:'100%',}}   >
							{
								job.deleted != null && job.deleted == true ? (
									 
										<h5  className="py-5 px-2 px-md-3 m-0  rounded text-muted workfolio">This job is no longer available.</h5>
									 
									  
								) : (
									<Job job={job}    />
								)
							}
							 
						</div>
					))} 
					
			</div>
			
		 
	);
	
};

export default  memo(JobList);
