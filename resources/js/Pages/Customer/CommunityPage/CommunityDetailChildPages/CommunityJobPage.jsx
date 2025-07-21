 import { memo }  from 'react';
 import {   useSelector } from 'react-redux'; 
 
 import Job from '../../../../Components/Customer/CompanyJob/Job';
import Sender from '../../../../Components/Customer/CommunityDetail/Sender'; 
 

const CommunityJobPage = () => { 
 		const jobList = useSelector((state) => state.appliedSavedJobList); //selecting   List from store
	
	 
	return ( 
		 <>
			 
			{
			 (jobList.jobList.length > 0  )  &&
			 (
					<div className="  px-0 py-3 px-sm-3 px-md-4 px-lg-5         "   >
				 
						{jobList.jobList.map((job, index) => ( 
								
								<div key={index}    style={{  maxWidth:'100%',}}   >
									{
										job.deleted != null && job.deleted == true ? (
											 
												<h5  className="py-5 px-2 m-0 mb-2 rounded text-muted workfolio">This job is no longer available.</h5>
											 
												
										) : (
											<>
												<Job job={job}   />
												<Sender 
													user={job.sender} 
													style="d-inline-flex    my-2     "
												/>			
											</>
											 
										)
									}
									 
								</div>
							))} 
							
					</div>
			 )
		 } 
			
			 
	 </>
	);
};

export default memo(CommunityJobPage);
