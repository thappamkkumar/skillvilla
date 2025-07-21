 
import {memo,  useCallback } from 'react'; 
import {useSelector    } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';  
import Button from 'react-bootstrap/Button';
 
import {         
  BsPencilFill,   
} from "react-icons/bs";

import handleImageError from '../../../CustomHook/handleImageError';  
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 
 
import UpdateProfileImage from '../AdminProfileUpdate/UpdateProfileImage';

const ProfileHeader= ({ profileData, setProfileData }) => { 

	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	    
	//function use to navigate to update profile
	const handleNavigateToUpdteProfile = useCallback(async()=>{ 
		//manageVisitedUrl(`/admin/update-profile`, 'append');
		navigate(`/admin/update-profile`);
	}, []);
	
	
	
	return ( 
		<div className="d-sm-flex   align-items-center   w-100"  >  
				<div className="profile_image_container  mx-auto mx-sm-0    RelativeContainer">
					<Image  
					src={profileData?.admin?.image || '/images/profile_icon.png'}
					 key={profileData?.admin?.image || "default-key"} 
					className="profile_image  d-block mx-auto mx-md-0 p-0 "
					onError={(event)=>{ handleImageError(event, '/images/profile_icon.png')} }
					alt="profile image "  roundedCircle thumbnail />
					 
					<UpdateProfileImage  
						setProfileData={setProfileData} 
					/>
				 
				</div>	
					
				<div className="ps-sm-3  ps-lg-5 pt-3 pt-sm-0 d-flex d-sm-block flex-column   align-items-center    ">
					<h3 className="   text-center text-sm-start userCard_userName">{profileData?.name}</h3>
					
					<h5 className="      text-center text-sm-start  userCard_userID ">{profileData?.userID}</h5>
					
					<Button 
						variant="dark" 
						onClick={handleNavigateToUpdteProfile} 
						className="    "  
						id="editProfile" 
						title="Edit Profile"> 
						<BsPencilFill className="mb-1 me-2" /> Edit 
					</Button> 
				
				</div>
				 
	</div>
			
		 
	);
	
};

export default memo(ProfileHeader);
