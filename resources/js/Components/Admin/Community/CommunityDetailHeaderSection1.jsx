import { memo, useCallback} from 'react';
import { useSelector, useDispatch} from 'react-redux';  
import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image';     
  
import handleImageError from '../../../CustomHook/handleImageError';
 import changeNumberIntoHumanReadableForm from '../../../CustomHook/changeNumberIntoHumanReadableForm'; 
  

const CommunityDetailHeaderSection1 = ({communityDetail  }) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info
	const navigate = useNavigate();
  const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
		 
	 
	 
	
	
  return (
    
			<div className="d-sm-flex   align-items-center   w-100"  >  
				<div className="profile_image_container  mx-auto mx-sm-0    RelativeContainer">
					<Image 
							 
							src={communityDetail.image || '/images/profile_icon.png'} 
							className="d-block mx-auto mx-sm-0 profile_image" 
							onError={(e) => handleImageError(e, '/images/profile_icon.png')}
							alt={`Community image of ${communityDetail.id}`} 
						 
					/> 
					 
					
				</div>	
					
					<div className="ps-sm-3  ps-lg-5 pt-3 pt-sm-0  d-flex d-sm-block flex-column   align-items-center  ">
							<h4 className="     fw-bold  ">{communityDetail.name}</h4>
							  
							<div className="  d-flex align-items-center   gap-3">
								<p className="m-0">
									<span className="pe-2 fs-4 fw-bold">
									{changeNumberIntoHumanReadableForm(communityDetail.members_count)}
									</span> 
									Members
								</p>
 									 
								<span className="  fs-4  "> |</span>
								
								<p className="m-0">
									<span className="pe-2 fs-4 fw-bold">
										{
										changeNumberIntoHumanReadableForm(communityDetail.requests_count)
										}
									</span>
									Requests
								</p>
									 
								
							</div>
								 
					</div>
				 
			</div>
			
			
			
			  
  );
};

export default memo(CommunityDetailHeaderSection1);
