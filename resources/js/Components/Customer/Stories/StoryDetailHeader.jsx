 
import  {useState, useEffect, useCallback,memo } from 'react'; 
import {useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
 
import { BsThreeDotsVertical, BsTrash3, BsShare  } from "react-icons/bs"; 
import ConfirmDialog from '../../ConfirmDialog'; 
import MessageAlert from '../../MessageAlert'; 

import serverConnection from '../../../CustomHook/serverConnection'; 
import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 

import {updateStoriesState} from '../../../StoreWrapper/Slice/StoriesSlice';
import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
 
 
const StoryDetailHeader = ({
	index, 
	userData,
	createAt,
	storyID, 
	deleteStory, 
	storyDeleted=false
	}) => { 
	
	const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
 	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [showConfirm, setShowConfirm] = useState(false);  
	
	
		
	//function use to handle story share
	const handleStoryShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: storyID}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "story"}));
		
	}, [storyID]);
	
	
	//delete story
	const handleDeletePost = useCallback(async()=>{
		try
		{  
			setShowConfirm(false); 
			if(storyID == null)
			{
				return;
			}
			let data = await serverConnection(`/delete-stories`, {id: storyID, }, authToken);
			 //console.log(data);
			 if(data != null && data.status == true)
			 {
					setsubmitionMSG( 'Story is deleted successfully.');
					setShowModel(true);
					//update   stories redux state 
					deleteStory(data.user_id, data.stories_id);
					dispatch(updateStoriesState({type : 'SetLoggedUserCanAddStory', canAddStory: true})); 
					if(data.storyCount == 0)
					{
						dispatch(updateStoriesState({ type: 'refresh'}));
					}
					else if(data.latestStory !=  null)
					{
						dispatch(updateStoriesState({ type: 'addLoggedUserNewStories', newStory: data.latestStory }));
					}
					else{}
			 }
			 else
			 {
					setsubmitionMSG( 'Oops! Something went wrong.');
					setShowModel(true); 
			 }
		}
		catch(error)
		{
			//console.log(error);
			setsubmitionMSG( 'Oops! Something went wrong.');
			setShowModel(true); 
		}
	}, [storyID]);
	
	 //navigate to user profile
	const handleNavigateToUserProfile = useCallback(()=>{
		if(loggedUserData.id == userData.id )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${userData.userID}/${userData.id}/profile`, 'append');
			navigate(`/user/${userData.userID}/${userData.id}/profile`);
		}
			
	}, []);
	 
	return (  
		<>
			<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeletePost}
        message="Are you sure you want to delete this post."
        confirmLabel="Delete"
				/>
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			<div className=" w-100   h-auto d-flex   justify-content-between  align-items-center    RelativeContainer"  >
				<div className="overflow-hidden px-2 py-3">
					<div className=" w-100  h-auto d-flex     align-items-center">
						<div className="btn p-0 border-0 " onClick={handleNavigateToUserProfile} > 
							<Image 
								src={userData.customer.image || '/images/login_icon.png'} 
								className="profile_img"
								onError={()=>{handleImageError(event, '/images/login_icon.png')} } 
								alt={`profile image of ${(userData!= null)&& userData.userID}, associated with post "${(userData!= null)&& userData.userID}"`}/> 
						</div>
						<div className="  p-0 border-0 ps-3  " style={{overflow:'hidden'}} >
							
							<Button variant="*" className="border-0 fs-5 fw-bold p-0 postTruncate" id={`userProfileNavigationBtn${index}${(userData!= null)&& userData.userID}`} title={`Go to user profile of ${(userData!= null)&& userData.userID}`} onClick={handleNavigateToUserProfile}>{(userData!= null)&& userData.userID} </Button> 
							<small>{createAt}</small>
						</div> 
						
					</div>
				</div>
				{
					storyDeleted == false &&
					(
						<Dropdown className="px-2 postMoreBTN h-auto  "> 
						 	<Dropdown.Toggle variant="*" id={`storyDropDown${index}`} title="more" className="border-0 p-1   custom_dropdown_toggle_post_header ">
								<BsThreeDotsVertical />
							</Dropdown.Toggle>
							
						<Dropdown.Menu className=" border-0 p-2  dropdown_menu shadow" style={{overflow:'hidden',}}>
							
							<Dropdown.Item as="button" variant="*" id={`shareStory${index}`} title={`Share story ${index}`}  className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleStoryShare}>
									<BsShare   /> <span className="px-2">Share </span>	  
							</Dropdown.Item>
							
							{
								userData.id == loggedUserData.id &&
								(	
									<>
										{/* Divider    */}
										<Dropdown.Divider />
										<Dropdown.Item as="button" variant="*" id={`deleteStoryButton${index}`} title="Delete Story" className="py-2 d-flex align-items-center  gap-2 rounded exploreFilterClearBTN" onClick={() => setShowConfirm(true)}>
											<BsTrash3  /> <span className="px-2">Delete </span>	
										</Dropdown.Item>
									</>
								)
							}
							
						</Dropdown.Menu>
					</Dropdown>
						
					)
				}
			
			</div>
		</>
		  
	);
	
};

export default memo(StoryDetailHeader);
