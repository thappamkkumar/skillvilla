 
import {memo,  useCallback } from 'react'; 
import {useSelector    } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';  
import Button from 'react-bootstrap/Button';
 
import handleImageError from '../../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
 
  
const ProfileHeader= ({ profileData, setUserProfileData }) => { 
	
	 const navigate = useNavigate(); //geting reference of useNavigate into navigate
	 
	 
	const { 
		id,
    userName, 
    userId,  
    totalFollowers, 
    totalFollowing, 
    userProfileImage, 
  } = profileData;  
	 
	   
	
	//function use to navigate to follower or following list
	const followerFollowingNavigate = useCallback(async(followType)=>{
		  //call function to add current url into array of visited url
			let url = null
			if(followType == 'followers')
			{
				url =`/user/${userId}/${id}/followers`
			}
			else
			{
				url =`/user/${userId}/${id}/followings`
			}
			//manageVisitedUrl(url, 'append');
			navigate(url);
	}, []); 
	
	
	
	 
	
	return ( 
		<div className="d-sm-flex   align-items-center   w-100"  >  
				<div className="profile_image_container  mx-auto mx-sm-0    RelativeContainer">
					<Image  
					src={userProfileImage || '/images/profile_icon.png'}
					 key={userProfileImage || "default-key"} 
					className="profile_image  d-block mx-auto mx-md-0 p-0 "
					onError={(event)=>{ handleImageError(event, '/images/profile_icon.png')} }
					alt="profile image "  roundedCircle thumbnail />
					  
						
					 
				</div>	
					
				<div className="ps-sm-3  ps-lg-5 pt-3 pt-sm-0 d-flex d-sm-block flex-column   align-items-center    ">
					<h3 className=" m-0   pb-2 text-center text-sm-start userCard_userName">{userName}</h3>
					<h5 className="   m-0  text-center text-sm-start  userCard_userID ">{userId}</h5>
					
					<div className="  h-auto m-0 pt-1 d-inline-flex gap-4  ">
						<Button variant="*"   className="   p-0   border-0"  id="followerBtn" title="Go to followers list"><strong className="fs-4 pe-2" >{totalFollowers}</strong> followers </Button>
						<Button variant="*"  className="   p-0 border-0"  id="followingBtn" title="Go to following list"><strong className="fs-4 pe-2" >{totalFollowing}</strong> followings </Button>
					</div>
					 
				
				</div>
				 
	</div>
			
		 
	);
	
};

export default memo(ProfileHeader);
