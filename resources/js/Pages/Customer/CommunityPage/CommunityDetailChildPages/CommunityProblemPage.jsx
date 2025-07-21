import { memo }  from 'react'; 
 import {   useSelector } from 'react-redux'; 
 
import Problem from '../../../../Components/Customer/Problem/Problem';
import Sender from '../../../../Components/Customer/CommunityDetail/Sender'; 
 
const CommunityProblemPage = () => { 
 		const problemList = useSelector((state) => state.savedProblemList);  //selecting   List from store
	
	 
	return ( 
		 <>
			 
			{
			 (problemList.problemList.length > 0  )  &&
			 (
					<div className="  px-0 py-4 px-sm-3 px-md-4 px-lg-5          "   >
					{problemList.problemList.map((problem, index) => ( 
						
						<div key={index} style={{  maxWidth:'100%',}}   >
							{
								problem.deleted != null && problem.deleted == true ? (
									 
										<h5  className="py-5 px-2 m-0 mb-2 rounded text-muted workfolio">This problem is no longer available.</h5>
									 
									  
								) : (
									<>
										<Problem problem={problem}   />
										<Sender 
											user={problem.sender} 
											style="d-inline-flex  my-2     "
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

export default memo(CommunityProblemPage);
