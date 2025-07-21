 
import {memo} from 'react';  
 import Freelance from '../Freelance/Freelance'; 

const FreelanceList = ({freelanceList }) => { 
	 
  
	return ( 
		 
			<div className="  px-0 py-3 px-sm-3 px-md-4 px-lg-5          "   >
				 
				{freelanceList.map((freelance) => ( 
						
						<div className=" mb-3    " key={freelance.id}   style={{  maxWidth:'100%',}}   >
							{
								freelance.deleted != null && freelance.deleted == true ? (
									
										<h5 className="py-5 px-2 px-md-3 m-0   rounded text-muted workfolio  ">This freelance work is no longer available.</h5>
									 
									  
								) : (
									<Freelance freelance={freelance}    />
								)
							}
							
							 
						</div>
					))} 
					
			</div>
			
		 
	);
	
};

export default  memo(FreelanceList);
