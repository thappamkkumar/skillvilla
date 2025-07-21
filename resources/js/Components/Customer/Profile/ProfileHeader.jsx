 
import {memo,  useCallback } from 'react'; 
import {useSelector, useDispatch    } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';  
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
 
import { BsThreeDotsVertical,   BsShare } from "react-icons/bs"; 

import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
 
import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
 
 
import UpdateProfileImage from '../ProfileUpdate/UpdateProfileImage';

const ProfileHeader= ({ profileData, setUserProfileData }) => { 
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	 
	const { 
		id,
    userName, 
    userId,  
    totalFollowers, 
    totalFollowing, 
    userProfileImage, 
  } = profileData;  
	 
	
	//function use to handle user share
	const handleUserShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: id}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "user"}));
	}, [id]);
	
  
	
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
		<div className="d-sm-flex   align-items-center   w-100 RelativeContainer"  >  
				<div className="profile_image_container  mx-auto mx-sm-0    RelativeContainer">
					<Image  
					src={userProfileImage || '/images/profile_icon.png'}
					 key={userProfileImage || "default-key"} 
					className="profile_image  d-block mx-auto mx-md-0 p-0 "
					onError={(event)=>{ handleImageError(event, '/images/profile_icon.png')} }
					alt="profile image "  roundedCircle thumbnail />
					{
						logedUserData.id == id &&
						<UpdateProfileImage   
							id={id} 
							setUserProfileData={setUserProfileData} 
						/>
						
					}
				</div>	
					
				<div className="ps-sm-3  ps-lg-5 pt-3 pt-sm-0 d-flex d-sm-block flex-column   align-items-center    ">
					<h3 className=" m-0   pb-2 text-center text-sm-start userCard_userName">{userName}</h3>
					<h5 className="   m-0  text-center text-sm-start  userCard_userID ">{userId}</h5>
					
					<div className="  h-auto m-0 pt-1 d-inline-flex gap-4  ">
						<Button variant="*" onClick={()=>{followerFollowingNavigate('followers')}} className="   p-0   border-0"  id="followerBtn" title="Go to followers list"><strong className="fs-4 pe-2" >{totalFollowers}</strong> followers </Button>
						<Button variant="*" onClick={()=>{followerFollowingNavigate('followings')}} className="   p-0 border-0"  id="followingBtn" title="Go to following list"><strong className="fs-4 pe-2" >{totalFollowing}</strong> followings </Button>
					</div>
					 
				
				</div>
				
				<Dropdown 
					style={{
						position:'absolute',
						top:'0px',
						right:'0px'
					}}
				> 
						 
					<Dropdown.Toggle variant="*" id="userProfileDropDown" title="more" className="border-0 p-1 custom_dropdown_toggle_post_header fs-5  px-2  pb-1 ">
							<BsThreeDotsVertical />
					</Dropdown.Toggle> 
							
					<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>  
					
						<Dropdown.Item as="button" variant="*" id="shareUserProfile" title="Share user profile" className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleUserShare}>
								<BsShare   /> <span className="px-2">Share </span>	  
						</Dropdown.Item> 
						
					</Dropdown.Menu>
					
				</Dropdown>	 
					
	</div>
			
		 
	);
	
};

export default memo(ProfileHeader);
