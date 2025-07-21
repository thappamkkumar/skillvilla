import {  memo, useCallback }  from 'react';    
import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image'; 
import { BsLink45Deg } from "react-icons/bs";
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
import handleImageError from '../../../../CustomHook/handleImageError';

const SharedCommunity = ({community}) => {

   
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	//function use to handle navigation to user profile
	const handleNavigateToCommunityProfile = useCallback(()=>{
		 
			//call function to add current url into array of visited url
		//	manageVisitedUrl(`/community/${community.id}/detail/posts`, 'append');
			navigate(`/community/${community.id}/detail/posts`);
		 
			
	}, [ community]);
	
	
	
  return (
	<div className=" mb-2">
		<div  
			className=" w-100  h-auto btn btn-light text-start d-flex     align-items-center"		
			style={{
				maxWidth:'300px', 
				cursor:'pointer'
			}}
			onClick={handleNavigateToCommunityProfile}
		>
      <div className="  p-0 border-0 "   > 
						
				<Image src={community?.image || '/images/login_icon.png'} 
				className="profile_img"
				onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
				alt={`profile image of ${community.name}`}/> 
				
			</div>
			<div className="ps-2 overflow-hidden">
				<strong className="d-block fw-semibold text-truncate">{community.name}</strong> 
				<small className="d-block text-truncate">{community.community_member_count || 0} Members</small>  
			</div>
			
		</div>
		
		<small className="text-secondary fw-bold"> <BsLink45Deg /> Community</small>
		
	</div>
  );
};

export default memo(SharedCommunity);
