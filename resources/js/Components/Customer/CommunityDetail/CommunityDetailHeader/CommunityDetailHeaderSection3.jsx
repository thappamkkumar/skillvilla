import { memo, useCallback, useState} from 'react';       
import { useSelector, useDispatch} from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button'; 
import Dropdown from 'react-bootstrap/Dropdown'; 
import { BsThreeDotsVertical, BsTrash3,   BsPencil, BsChat, BsShare  } from "react-icons/bs";

 
import CommunityActionButton from '../../Community/CommunityActionButton';
import ConfirmDialog from '../../../ConfirmDialog';
import MessageAlert from '../../../MessageAlert';

import handleLeaveCommunity from '../../Community/ActionFunction/handleLeaveCommunity';
import handleJoinCommunity from '../../Community/ActionFunction/handleJoinCommunity';
import handleRequestToJoin from '../../Community/ActionFunction/handleRequestToJoin';


import {updateCommunityState as updateYourCommunityState} from '../../../../StoreWrapper/Slice/YourCommunitySlice';
import {updateCommunityMessageState} from '../../../../StoreWrapper/Slice/CommunityMessageSlice';
import { updateShareStatsState } from '../../../../StoreWrapper/Slice/ShareStatsSlice';
 
//import {updateCommunityDetailState} from '../../../../StoreWrapper/Slice/CommunityDetailSlice';

//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../../CustomHook/serverConnection';

const CommunityDetailHeaderSection3 = ({communityDetail, communityId, setCommunityDeleted}) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	const [showConfirm, setShowConfirm] = useState(false); 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [deleted, setDeleted] = useState(false); //state for alert message  
	const [deleting, setDeleting] = useState(false); //state for alert message  
	
	const [submitting, setSubmitting] = useState(false);  
	
	//handle navigate to message box
	const handleNavigateToCommunityChatPage = useCallback(()=>
	{
		dispatch(updateCommunityMessageState({type:'refresh'})); 
		let url = `/community/${communityDetail.id}/messages`;
		//manageVisitedUrl(url,'append' );
		navigate(url);
	},[communityDetail.id ]);	
	
	//handle navigate to community update page
	const handleNavigateToCommunityUpdatePage = useCallback(()=>
	{ 
		let url = `/community/${communityDetail.id}/update`;
		//manageVisitedUrl(url,'append' );
		navigate(url);
	},[communityDetail.id ]);	
	
	
	
	//function use to handle community share
	const handleCommunityShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: communityDetail.id}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "community"}));
		
	}, [communityDetail.id]);
	
	
	
	 
	 //handle deleting community
	const confirmDelete = useCallback(async()=>
	{ 
		setShowConfirm(false); 
		if(authToken == null) return;
		try
		{
			setDeleting(false);
			let data = await serverConnection(`/delete-community`, {communityId: communityDetail.id, }, authToken);
			 
			 // console.log(data);
			if(data && data.status == true)
			{
				setsubmitionMSG( 'Community is deleted successfully.'); 
				setDeleted(true);
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the Community. Please try again.'); 
			}
		}
		catch(error)
		{
			//console.log(error);
			setsubmitionMSG( 'An error occurred. Please try again.'); 
			 
		} 
		finally{
			setDeleting(false);
			setShowModel(true);
		}
	},[communityDetail.id, authToken ]);	
	
	
	// Close modal  
	const handleModalClose = useCallback((val) => {
		setShowModel(false);  
		if(deleted == true)
		{ 
			setCommunityDeleted(true);
			dispatch(updateYourCommunityState({ type: 'removeCommunity',cummunityId:communityDetail.id }));
		}
	
	},[dispatch, setShowModel, deleted, communityDetail.id]);
	
	 
    return (
			<div className=" d-flex gap-2 justify-content-between align-items-start    pt-3  ">
			
				<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={confirmDelete}
        message="Are you sure you want to delete this community."
        confirmLabel="Delete"
				/>
				
				<MessageAlert setShowModel={handleModalClose} showModel={showModel} message={submitionMSG}/>
				
				<div className="   d-flex flex-wrap gap-3">
					 <Button
							variant="outline-dark"
							id={`naviagteToMessageBox${communityDetail.id}`}
							title="Talk to the Community" 
							onClick={handleNavigateToCommunityChatPage}
						>
							<BsChat className="mb-1 me-2" /> Message  
						</Button>
						
						<CommunityActionButton 
							community={communityDetail}
							submitting={submitting}
							 
							handleJoinCommunity={() => handleJoinCommunity( communityDetail, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken, communityId)}
								
							handleLeaveCommunity={() => handleLeaveCommunity( communityDetail, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken, communityId)}
								
							handleRequestToJoin={() => handleRequestToJoin( communityDetail, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken, communityId)}
							
							size = 'md'
						/>
								 		
				</div>
				
					<Dropdown  >
					 <Dropdown.Toggle variant="light" id="communityDropDownMenuBtn" title="More"  className="    custom_dropdown_toggle_post_header   fs-5  px-2 pt-0  ">
							<BsThreeDotsVertical  />
						</Dropdown.Toggle>
					 
					 
					<Dropdown.Menu className="p-2 border-0 dropdown_menu shadow" style={{overflow:'hidden',}}>
						
						<Dropdown.Item as="button" variant="*" id="shareCommunity" title="Share community " className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleCommunityShare}>
									<BsShare   /> <span className="px-2">Share </span>	  
							</Dropdown.Item>
							
						
						{
							logedUserData.id == communityDetail.created_by &&
							<>
								<Dropdown.Item as="button" 
								variant="primary" 
								id="editCommunity" 
								title="Update community detail"
								className="py-2 d-flex align-items-center gap-2   rounded navigation_link" 
								onClick={handleNavigateToCommunityUpdatePage}
								>
								<BsPencil  /> <span className="px-2">Update</span>
								</Dropdown.Item>
								
								{/* Divider    */}
									<Dropdown.Divider />
										
								<Dropdown.Item as="button" 
								variant="primary" 
								id="deleteCommunity" 
								title="Delete community"
								className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" 
								onClick={() =>  setShowConfirm(true)}
								disabled = {deleting}
								>
								<BsTrash3  /> <span className="px-2">Delete</span>
								</Dropdown.Item>
							</>
						}	
							 
							
							
						 
						</Dropdown.Menu>
					</Dropdown>
				
				
		</div>
    );
   
  
};

export default memo(CommunityDetailHeaderSection3);
