import { memo } from 'react';
import Member from './Member'; 

const CommunityMemberList = ({ memberList }) => {
  return ( 
       
        
				<div className=" "> 
					{memberList.map((member) => (
						<Member key={member.id} member={member} />
					 ))}
				</div>
       
       
  );
};

export default memo(CommunityMemberList);
