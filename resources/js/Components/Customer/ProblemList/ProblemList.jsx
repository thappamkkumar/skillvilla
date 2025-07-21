 
import {memo} from 'react';  
 import Problem from '../Problem/Problem'; 

const ProblemList = ({problemList}) => { 
	 
  
	return ( 
		 
			<div className="  px-0 py-4 px-sm-3 px-md-4 px-lg-5          "   >
				 {problemList.map((problem) => ( 
						
						<div className=" mb-3    " key={problem.id} style={{  maxWidth:'100%',}}   >
							{
								problem.deleted != null && problem.deleted == true ? (
									 
										<h5  className="py-5 px-2 px-md-3 m-0   rounded text-muted workfolio">This problem is no longer available.</h5>
									 
									  
								) : (
									<Problem problem={problem}   />
								)
							}
							 
						</div>
					))} 
					
			</div>
			
		 
	);
	
};

export default  memo(ProblemList);
