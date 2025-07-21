import { memo, useCallback} from 'react'; 
 
import LargeText from '../../Common/LargeText';
import CommunityDetailHeaderSection1 from './CommunityDetailHeader/CommunityDetailHeaderSection1';
import CommunityDetailHeaderSection2 from './CommunityDetailHeader/CommunityDetailHeaderSection2';
import CommunityDetailHeaderSection3 from './CommunityDetailHeader/CommunityDetailHeaderSection3';
   

const CommunityDetailHeader = ({communityDetail, communityId, setCommunityDeleted}) => {
	
	//if(communityDetail == null)return;   don't remove it, it can be used if have issue
	
	
	 
	
  return (
    <div className=" " > 
			
			{/*it render community name, image and   total members and total request  */}
			<CommunityDetailHeaderSection1 
				communityDetail={communityDetail}  
			/> 
			
			<hr className="my-4"/>
			
			{/*it render privacy and content share access*/}
			<CommunityDetailHeaderSection2 
				communityDetail={communityDetail}  
			/> 
			
			
			{/*it render message btn and join or request or leave or cancel request btn and request status*/}
			<CommunityDetailHeaderSection3 
				communityDetail={communityDetail}  
				communityId={communityId} 
				setCommunityDeleted={setCommunityDeleted} 
			/> 
			
			
			<hr className="my-4"/>
			
			{/*description*/}
			 <div className="   ">
						<h4>Description</h4>
						<LargeText largeText={communityDetail.description} />
				</div>
				
				
		</div>
  );
};

export default memo(CommunityDetailHeader);
