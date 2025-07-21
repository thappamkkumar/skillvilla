import { memo, useEffect, useState , useCallback} from 'react';
 
import {useParams, useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';   

//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';  
import handleImageError from '../../../../CustomHook/handleImageError';  

const FollowersFollowing = ({followersFollowing, followType}) => { 
  const navigate = useNavigate(); //geting reference of useNavigate into navigate
	//state to store user profile image
	const [userProfile, setUserProfile] = useState('login_icon.png'); 
	 
	useEffect(()=>{
		//verify the user is candidate or recuiter and return image 
		if(followType == 'followers')
		{
			setUserProfile(followersFollowing?.follower?.customer?.image);		
		}
		else
		{
			setUserProfile(followersFollowing?.following?.customer?.image);
		}
	},[followType]);
	const handleNavigateToUserProfile = useCallback(()=>{
		 
		 let url = null;
		 if(followType == 'followers')
		 {
			 url = `/user/${followersFollowing.follower.userID}/${followersFollowing.follower.id}/profile`
		 }
		 else
		 {
			 url = `/user/${followersFollowing.following.userID}/${followersFollowing.following.id}/profile`
		 }
		 //call function to add current url into array of visited url
		 
			//manageVisitedUrl(url, 'append');
			navigate(url);
	}, []);

  return (
    
	
				<div className=" btn   followingFollower  border border-1 mx-auto my-2    d-flex flex-wrap   align-items-center p-2   " onClick={handleNavigateToUserProfile}>
					 
				 	<div className=" p-0 border-0 " > 
						<Image src={ userProfile || '/images/login_icon.png'} 
						className="rounded-circle profile_img" 
						onError={()=>{handleImageError(event, '/images/login_icon.png')} }
						alt={`profile image of ${followType == 'followers' ? (followersFollowing.follower.userID) : (followersFollowing.following.userID) }`}/> 
						
					</div>
					
					<div className=" ps-2" >
						<p className="p-0 m-0 text-start followerFollowingTruncate"><strong>{followType == 'followers' ? (followersFollowing.follower.userID) : (followersFollowing.following.userID) }  </strong></p>
						<p className="p-0 m-0 text-start followerFollowingTruncate">{followType == 'followers' ? (followersFollowing.follower.name) : (followersFollowing.following.name) } </p>
					</div> 
					 
				</div>
		 
  );
};

export default memo(FollowersFollowing);
