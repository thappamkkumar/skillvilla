 
import {memo,   useEffect, useCallback } from 'react'; 
import {useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button';

import {  
  BsChat,          
  BsPencilFill,    
  BsHeart,        
  BsHeartFill,     
} from "react-icons/bs";

 import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
 
  
import serverConnection from '../../../CustomHook/serverConnection';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';


const ProfileActionButton= ({ profileData, setUserProfileData }) => { 
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
 	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	 
	const { 
		id,
    userName, 
    userId, 
		isFollowing,   
		chatId
  } = profileData;  
	  
	//function to handle the follow and unFollow event or functionality
	const handleFollow = useCallback(async()=>{
		if(!id || !authToken) return;
		let data = {
			userId:id,
		}; 
		try
		{
			let result = await serverConnection(`/follow-user`, data, authToken);
			setUserProfileData((prevUserProfileData) => ({
								...prevUserProfileData,
								followers_count: result.followers_count,
								isFollowing: result.is_follow,
						}));
						
		}
		catch(error)
		{
			console.log(error);
		}
	}, [id, authToken, setUserProfileData]);
	
	
	//function use to navigate to update profile
	const handleNavigateToUpdteProfile = useCallback(async()=>{
	  //call function to add current url into array of visited url
		//manageVisitedUrl(`/profile/update-profile`, 'append');
		navigate(`/profile/update-profile`);
	}, []);
	
	
	//function use to handle api call for creating chat in chat ListFormat
	const createChat = useCallback(async()=>{
		try
		{ 
			 //call the function fetcg post data fron server
			let data = await serverConnection(`/create-chat`, {user_id:id }, authToken);
			 
			 // console.log(data);
			 if(data.status == true   )
			 {    	 
					let url =`/chat/${data.chat_id}`;		 
					//manageVisitedUrl(url, 'append');
					navigate(url);
			 }
			 
		}
		catch(error)
		{
			//console.log(error); 
		}
			
	}, [authToken,id]);
	
	
	
	//handle navigation to chatBox
	const navigateToChatBox = useCallback(()=>{
		 
		dispatch(updateChatMessageState({type : 'refresh'}));  
			
		//call function to add current url into array of visited url
		if(chatId == null)
		{
			createChat();
		}
		else
		{
			 	
			let url =  `/chat/${chatId}`;	
		//	manageVisitedUrl(url, 'append');
			navigate(url);
		} 
		
	}, [chatId, createChat, navigate]);
	
	
	return ( 
		<div className="w-100 h-auto m-0 pt-4  pb-4   ">
			{
				logedUserData.id == id &&
				<Button 
				variant="dark" 
				onClick={handleNavigateToUpdteProfile} 
				className="d-block   mx-auto mx-md-3 px-5  "  id="editProfile" 
				title="Edit Profile"> 
				<BsPencilFill className="mb-1 me-2" /> Edit 
				</Button> 
			}
			{
				logedUserData.id != id &&
				<div className="d-flex gap-3">
					<Button 
						variant="outline-dark" 
						onClick={navigateToChatBox}
						className="     flex-grow-1 w-100" 
						id="messageBtn"
						title="Chat with user">
						<BsChat className="mb-1 me-2" /> Message
					</Button>
					
					<Button 
						variant="dark"
						onClick={handleFollow} 
						className="    flex-grow-1 w-100"
						id={`${isFollowing ? 'unFollowBTn' : 'followBTn'}` }
						title={`${isFollowing ? 'UnFollow' : 'Follow'} the user` }>
						{isFollowing ? <><BsHeartFill className="mb-1 me-2  " /> Following</> : <><BsHeart className="mb-1 me-2" /> Follow</>}
					</Button>
					
					
				</div>
			 
				
			}
		</div>
			 
	);
	
};

export default memo(ProfileActionButton);
