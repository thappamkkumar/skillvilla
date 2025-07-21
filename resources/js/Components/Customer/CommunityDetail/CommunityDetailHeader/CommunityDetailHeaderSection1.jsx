import { memo, useCallback} from 'react';
import { useSelector, useDispatch} from 'react-redux';  
import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image';    
import Button from 'react-bootstrap/Button';   

import UpdateCommunityImagePage from '../../CommunityUpdate/UpdateCommunityImagePage';

import {updateCommunityMemberState} from '../../../../StoreWrapper/Slice/CommunityMemberSlice';
import {updateCommunityRequestState} from '../../../../StoreWrapper/Slice/CommunityRequestSlice';

import handleImageError from '../../../../CustomHook/handleImageError';
 import changeNumberIntoHumanReadableForm from '../../../../CustomHook/changeNumberIntoHumanReadableForm'; 
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl'; 


const CommunityDetailHeaderSection1 = ({communityDetail  }) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info
	const navigate = useNavigate();
  const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
		 
	 
	const handleNavigationToCommunityMembers = useCallback(()=>{
		dispatch(updateCommunityMemberState({type:'refresh'})); 
		const url = `/community/${communityDetail.id}/detail/members`;
		//manageVisitedUrl(url,'append' );
		navigate(url);
		
	}, [communityDetail.id]);
	
	const handleNavigationToCommunityRequests = useCallback(()=>{
		dispatch(updateCommunityRequestState({type:'refresh'}));  
		const url = `/community/${communityDetail.id}/detail/requests`;
		//manageVisitedUrl(url,'append' );
		navigate(url);
		
	}, [communityDetail.id]);
	 
	
	
  return (
    
			<div className="d-sm-flex   align-items-center   w-100"  >  
				<div className="profile_image_container  mx-auto mx-sm-0    RelativeContainer">
				 
					<Image 
							 
							src={communityDetail.image || '/images/profile_icon.png'} 
							className="d-block mx-auto mx-sm-0 profile_image" 
							onError={(e) => handleImageError(e, '/images/profile_icon.png')}
							alt={`Community image of ${communityDetail.id}`} 
						 
					/> 
					{
						communityDetail.created_by == logedUserData.id &&
						<UpdateCommunityImagePage   communityId={communityDetail.id} />
					}
					
				</div>	
					
					<div className="ps-sm-3  ps-lg-5 pt-3 pt-sm-0  d-flex d-sm-block flex-column   align-items-center  ">
							<h4 className="     fw-bold  ">{communityDetail.name}</h4>
							  
							<div className="  d-flex align-items-center   gap-3">
								<Button
									variant="outline-light"
									id="communityMembers"
									title="List of community members"
									className="p-0  post_tags" 
									style={{background:'transparent'}	}
									onClick = {handleNavigationToCommunityMembers}
								>
									<span className="pe-2 fs-4 fw-bold">
									{changeNumberIntoHumanReadableForm(communityDetail.members_count)}
									</span> 
									Members
								</Button>
								{
									logedUserData.id == communityDetail.created_by && communityDetail.privacy == "private" && 
									<>
										<span className="  fs-3  "> |</span>
										<Button
											variant="outline-light"
											id="communityRequests"
											title="List of community request"
											className="p-0    post_tags"
											style={{background:'transparent'}	}	
											onClick={handleNavigationToCommunityRequests}
										>
											<span className="pe-2 fs-4 fw-bold">
												{
												changeNumberIntoHumanReadableForm(communityDetail.requests_count)
												}
											</span>
											Requests
										</Button>
									</>
								}
								
							</div>
								 
					</div>
				 
			</div>
			
			
			
			  
  );
};

export default memo(CommunityDetailHeaderSection1);
