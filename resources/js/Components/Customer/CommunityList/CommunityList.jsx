import {memo, } from 'react'; 
import ListGroup from 'react-bootstrap/ListGroup'; 
import Community from '../Community/Community';

const CommunityList = ({communityList}) => {
  
	 
	 
	
  return (
     
    
				 
							<ListGroup  className="p-0   rounded-0 overflow-hidden"  >
						
								{   communityList.map((community) => (
								
									<Community key={community.id} community={community}  />
									
								))}
							</ListGroup>
							 
						 
				 
			 
		
     
  );
};

export default  memo(CommunityList);
