import { memo } from 'react';
import Request from './Request'; 

const CommunityRequestList = ({ requestList }) => {
  return ( 
       
        
				<div className="  "> 
					{requestList.map((request) => (
						<Request key={request.id} request={request} />
					 ))}
				</div>
        
  );
};

export default memo(CommunityRequestList);
