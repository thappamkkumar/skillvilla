import   {memo, useState, useCallback } from 'react';  
import {useSelector, useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';  
import Image from 'react-bootstrap/Image';  
import Button from 'react-bootstrap/Button';  
import Dropdown from 'react-bootstrap/Dropdown';
import { BsThreeDotsVertical,  BsCircleFill, BsCircle} from "react-icons/bs";


import {updateLiveStreamState} from '../../../../../../StoreWrapper/Slice/LiveStreamSlice';

import serverConnection from '../../../../../../CustomHook/serverConnection';
import handleImageError from '../../../../../../CustomHook/handleImageError';


const Viewer = ({
	liveId, 
	viewer, 
	setResizeScreen,
	setsubmitionMSG,
	setShowModel,
	})=>{
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const authToken = useSelector((state) => state.auth.token); //selecting token from store 
	
	const [updating, setUpdating] = useState(false);
	
	
	const navigate = useNavigate();
	const dispatch = useDispatch();
	
	//function use to handle navigation to user profile
	const handleNavigateToUserProfile = useCallback(( )=>{
		const ID = viewer?.user?.id;
		const userID = viewer?.user?.userID;
		const url = logedUserData.id == ID ? '/profile' : `/user/${userID}/${ID}/profile` ;
		
		setResizeScreen(pre => !pre);
		navigate(url); 
	}, [logedUserData]);
	
	
	//api call for update can_live or can_message 
	const handleAccessUpdate = useCallback(async(type) => {
    if(!authToken || updating)
		{
			return;
		}
		try
		{
			setUpdating(true);
			const reqData = {
				liveId: liveId,
				viewer_id: viewer.id,
				type: type,
			}; 
			
			//call api to create quick live stream
			const result = await serverConnection('/live-stream-update-viewer-can', reqData, authToken);
			
			//console.log(result);
			 
			
			if(result?.status)
			{		 
		 
				const updatedData = {
					liveId : liveId,
					viewerId : viewer.id,
					type : type, 
					can_do : type === 'can_live' ? result.updated_viewer?.can_live : result.updated_viewer?.can_message,
				};
				 
				 
				dispatch(updateLiveStreamState(
					{ 
					'type':'updateViewerCan',  
					'updatedData': updatedData
					}
				));
			}
			else
			{
				setsubmitionMSG(result?.message || 'Failed to update access. Please try again.');
				setShowModel(true);
			}
		}
		catch(e)
		{
			console.log('error:- ' + e);
			setsubmitionMSG('An error occurred. Please try again.');
			setShowModel(true);
		}
		finally
		{ 
			setUpdating(false);
		}
			
			
			
  }, [authToken, liveId]);

	
	const handleViewerCanLiveChange = useCallback(()=>{
		handleAccessUpdate('can_live');
	},[]);
	const handleViewerCanMessageChange = useCallback(()=>{
		handleAccessUpdate('can_message');
	},[]);
	
	return (
	 
		<div className="w-100 px-2 py-2 d-flex  align-items-center justify-content-between gap-4" > 
			<div className="    d-flex   align-items-center" > 
		
			 {/* IMAGE */}
				<div className="btn p-0 border-0">
					<Image
						src={viewer?.user?.customer?.image || "/images/login_icon.png"}
						className="profile_img"
						alt={`profile image of ${viewer?.user?.userID || "user"}`}
						onError={(e) => handleImageError(e, "/images/login_icon.png")}
						onClick={handleNavigateToUserProfile}
					/>
				</div>
				
				
				{/* TEXT Only on XL+ */}
				<div className=" d-flex flex-column  "  >
					<Button 
						variant="dark"
						id={`viewer${viewer.user.userID}Profile`}
						title={`Go To ${viewer.user.name || "Unknown User"} Profile`} 
						className="p-0 px-2   text-truncate overflow-hidden text-nowrap text-light strong text-start"
						onClick={handleNavigateToUserProfile}
					>
						{viewer?.user?.name || "Unknown User"} 
						
					</Button>
					
					{
						!viewer?.isConnecting &&   viewer?.error == null &&  
						<small
							className=" px-2   text-truncate overflow-hidden text-nowrap text-secondary d-block "
						>
						{viewer?.user?.userID}
						</small> 
					}
					
					{
						viewer?.isConnecting && 
						<small
							className=" px-2   text-truncate overflow-hidden text-nowrap text-secondary  "
						>
							Connecting
							<span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
						</small> 
					}
					{
						!viewer?.isConnecting && viewer?.error && viewer?.error.trim() != "" &&
						<small
							className=" px-2   text-truncate overflow-hidden text-nowrap text-danger  "
						>
						{viewer?.error} 
						</small> 
					}
					
					
				</div>
				
			
			</div>
			
			
			<div  >
				<Dropdown  > 
					<Dropdown.Toggle variant="dark" id={`liveStreamViewerDropDown${viewer?.user?.id}`} title="more" className="border-0  custom_dropdown_toggle_post_header ">
						<BsThreeDotsVertical />
					</Dropdown.Toggle>
					<Dropdown.Menu className="p-2 border-0 shadow overflow-hidden dropdown_menu"  >
						
						<Dropdown.Item 
							as="button" 
							variant="light" 
							id={`viewer_action_${viewer?.user?.id}_canLive`}
							title={`Toggle 'Can Live' permission for ${viewer?.user?.name || "viewer"}`} 
							className="py-2 d-flex align-items-center gap-2  rounded  navigation_link" 
							onClick={handleViewerCanLiveChange}
							disabled={updating || viewer?.isConnecting}
						>
							{viewer.can_live ? (
									<BsCircleFill size={14} color="var(--bs-success)" />    
								) : (
									<BsCircle size={14} color="var(--bs-secondary)" />   
								)}

								<span className="">Can Live</span>
   
						</Dropdown.Item>
						
						<Dropdown.Divider /> 
						
						<Dropdown.Item
							as="button"
							variant="light"
							id={`viewer_action_${viewer?.user?.id}_canMessage`}
							title={`Toggle 'Can Message' permission for ${viewer?.user?.name || "viewer"}`}
							className="py-2 d-flex align-items-center gap-2 rounded navigation_link"
							onClick={handleViewerCanMessageChange}
							disabled={updating || viewer?.isConnecting}
						>
							{viewer.can_message ? (
								<BsCircleFill size={14} color="var(--bs-success)" />
							) : (
								<BsCircle size={14} color="var(--bs-secondary)" />
							)}

							<span>Can Message</span>
						</Dropdown.Item>

									
									
					</Dropdown.Menu>
				</Dropdown>
					
			</div>
		
		</div>
	);		
};

export default memo(Viewer);