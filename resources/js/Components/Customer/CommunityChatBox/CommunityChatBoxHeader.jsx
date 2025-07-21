import {memo } from 'react'; 
import Image from 'react-bootstrap/Image'; 
 
import handleImageError from '../../../CustomHook/handleImageError'; 
 




const CommunityChatBoxHeader = ({communityData, communityId}) => { 
	
	 
 
  return (
	 
				
			<div className="  px-2 py-1   h-auto     d-flex justify-content-between align-items-center " >
				<div className="d-flex align-items-center overflow-hidden ps-1 py-1   ">
					<div className="   p-0 border-0 "  > 
						<Image 
							src={communityData.image || '/images/login_icon.png'}  
							className="profile_img  " 
							onError={()=>{handleImageError(event,'/images/login_icon.png')} }
							alt={`Community image of ${communityData.name}`}
						/> 
						
					</div>
					<div className=" p-0  ps-2     text-start  border-0 text-truncate"  >
							<strong className="d-block fw-bold fs-5 text-truncate  ">{communityData.name}  </strong> 
							
					</div>
				</div>
				 
			</div>
		 
  );
};

export default memo(CommunityChatBoxHeader);
