 
import {memo} from 'react';  
import FreelanceBid from '../FreelanceBid/FreelanceBid'; 

const FreelanceBidList = ({freelanceBidList }) => { 
	 
  
	return ( 
		 
			<div className="    py-3   "   >
				 
				{freelanceBidList.map((freelanceBid) => ( 
						
						<div key={freelanceBid.id}   style={{  maxWidth:'100%',}}   >
							 
							 	<FreelanceBid freelanceBid={freelanceBid}    /> 
								 
						 
						</div>
					))} 
					
			</div>
			
		 
	);
	
};

export default  memo(FreelanceBidList);
