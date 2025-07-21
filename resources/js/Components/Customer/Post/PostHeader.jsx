 

import   {memo, useState, useCallback } from 'react';   

import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux';  
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
 
import { BsThreeDotsVertical, BsTrash3, BsCardText,  } from "react-icons/bs"; 

import { updatePostState } from '../../../StoreWrapper/Slice/MyPostSlice'; 
//import { updatePostState as updateUserPostState } from '../../../StoreWrapper/Slice/UserPostSlice';


import ConfirmDialog from '../../ConfirmDialog';
import MessageAlert from '../../MessageAlert';
import handleImageError from '../../../CustomHook/handleImageError';
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';

const PostHeader = ({userProfile, userID, ID, style, postID,userName, chatBox, detail=false, setPostDetail=()=>{} }) => {
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [showConfirm, setShowConfirm] = useState(false); 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [deleted, setDeleted] = useState(false); //state for alert message  
	
	const dispatch = useDispatch();
	   
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
		if(logedUserData.id == ID )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${userID}/${ID}/profile`, 'append');
			navigate(`/user/${userID}/${ID}/profile`);
		}
			
	}, [logedUserData]);
	
	
	
	
	//function use to handle navigation to post detail
	const navigateToPostDetail = useCallback(() =>
	{  
		//call function to add current url into array of visited url
		//manageVisitedUrl(`/post-detail/${postID}`, 'append');
		navigate(`/post-detail/${postID}`); 
	}, [postID]);
	
	//function use to handle post delete
	const handleDeletePost = useCallback(async()=>{
		setShowConfirm(false); 
		let data = await serverConnection(`/delete-post`, {postId: postID, }, authToken);
			 
			// console.log(data);
			 if(data.status == true)
			 {
					setsubmitionMSG( 'Post is deleted successfully.');
					setShowModel(true);
					setDeleted(true);
					
					 
			 }
			 else
			 {
					setsubmitionMSG( 'Oops! Something went wrong.');
					setShowModel(true); 
			 }
			  
		
	}, [authToken, postID]);
	
	// Close modal  
	const handleModalClose = useCallback((val) => {
		setShowModel(false);  
		if(deleted == true)
		{
			setPostDetail(null);
			dispatch(updatePostState({type : 'postDelete', postID: postID}));
			//dispatch(updateUserPostState({type : 'postDelete', postID: postID}));
		}
	
	},[dispatch, setShowModel, deleted, postID]);
	
	return ( 
		<>
			<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeletePost}
        message="Are you sure you want to delete this post."
        confirmLabel="Delete"
				/>
			<MessageAlert setShowModel={handleModalClose} showModel={showModel} message={submitionMSG}/>
			<div className=" w-100 p-1  h-auto d-flex   justify-content-between  align-items-center    RelativeContainer"  >
				<div className="overflow-hidden p-2">
					<div className=" w-100  h-auto d-flex     align-items-center">
						<div className="btn p-0 border-0 " onClick={handleNavigateToUserProfile} > 
						
							<Image src={userProfile || '/images/login_icon.png'} 
							className={`${style}  `}
							onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
							alt={`profile image of ${userID}, associated with post "${postID}"`}/> 
							
						</div>
						<div className="btn p-0 border-0 ps-3  " style={{overflow:'hidden'}} >
							
							<Button variant="*" className="border-0   fw-bold text-start p-0  postTruncate" id={`userProfileNavigationBtn${postID}${userID}${userName}`} title={`Go to user profile of ${userID}`} onClick={handleNavigateToUserProfile}> {userName} </Button> 
					
							<Button variant="*" className="border-0 p-0    text-start  postTruncate" id={`userProfileNavigationBtn${postID}${userID}`} title={`Go to user profile of ${userID}`} onClick={handleNavigateToUserProfile}> <small>{userID}</small> </Button> 
					 
						</div> 
						
					</div>
				</div>
				<div>
					<Dropdown className="pe-2 postMoreBTN"> 
						{ detail ==  false &&  
							<Dropdown.Toggle variant="*" id={`postDropDown2${postID}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
								<BsThreeDotsVertical />
							</Dropdown.Toggle>
						}
						{ detail ==  true &&  logedUserData.id == ID &&
							<Dropdown.Toggle variant="*" id={`postDropDown2${postID}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
								<BsThreeDotsVertical />
							</Dropdown.Toggle>
						}
						
						<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
							{ detail ==  false && 
								<Dropdown.Item as="button" variant="*" id={`gotToPostDetail${postID}`} title={`Go to details of post ${postID}`}  className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={navigateToPostDetail}>
									<BsCardText   /> <span className="px-2">Detail </span>	  
								</Dropdown.Item>
							}
							
							
							{/* Divider    */}
							{
									logedUserData.id == ID && !chatBox && !detail &&
									<Dropdown.Divider /> 
							}
						 
								
							{
								logedUserData.id == ID && !chatBox &&
								<>
								
									<Dropdown.Item as="button" variant="*" id={`deletePostButton${postID}`} title={`Delete Post ${postID}`} className="py-2 d-flex align-items-center gap-2  rounded exploreFilterClearBTN" onClick={() =>  setShowConfirm(true)}>
										<BsTrash3  /> <span className="px-2">Delete </span>	
									</Dropdown.Item>
								</>
							}
						</Dropdown.Menu>
					</Dropdown>
				
				</div>
			</div>
		</>
	);
	
};

export default memo(PostHeader);
