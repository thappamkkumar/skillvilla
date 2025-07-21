 

import   {memo, useState, useCallback, useEffect } from 'react';   

import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux'; 
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
 
import { BsThreeDotsVertical, BsTrash3, BsCardText, BsBookmarkPlus, BsBookmark, BsShare } from "react-icons/bs"; 

import {updateWorkfolioState} from '../../../StoreWrapper/Slice/WorkfolioSlice';
import {updateWorkfolioState as updateUserWorkfolioState} from '../../../StoreWrapper/Slice/UserWorkfolioSlice';
import {updateWorkfolioState as updateMyWorkfolioState} from '../../../StoreWrapper/Slice/MyWorkfolioSlice';
import {updateWorkfolioState as updateSavedWorkfolioState} from '../../../StoreWrapper/Slice/SavedWorkfolioSlice';
import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice';
 
 
import ConfirmDialog from '../../ConfirmDialog'; 
import MessageAlert from '../../MessageAlert'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';

const WorkfolioHeader = ({
title, 
user_id, 
workfolio_id,
has_saved,
chatBox, 
detail=false, 
setWorkfolioDetail=()=>{}, 
}) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [showConfirm, setShowConfirm] = useState(false); 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	const [deleted, setDeleted] = useState(false); //state for alert message  
	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	 
	//handle navigate to work detail 
	const handleNavigateWorkDetail = useCallback(()=>
	{ 
		if(detail == true)
		{
			return;
		}
	//	manageVisitedUrl(`/workfolio-detail/${workfolio_id}`, 'append');
		navigate(`/workfolio-detail/${workfolio_id}`);
	},[workfolio_id]);
	
	
	//function use to handle workfolio share
	const handleWorkfolioShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: workfolio_id}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "workfolio"}));
		
	}, [workfolio_id]);
	
	
	
	//function for handle workfolio save
	const handleWorkfolioSave = useCallback(async()=>{
		 
		if(workfolio_id == null || authToken == null)
		{
			return;
		}
		 
		let data = await serverConnection(`/save-workfolio`, {workfolio_id: workfolio_id, }, authToken);
		   // console.log(data);
		 if(data && data.status == true)
		 {
			 if(data.has_saved == true)
			 {
					setsubmitionMSG( 'Work has been saved successfully!');
			 }
			 else
			 {
				 setsubmitionMSG( "Work has been removed from saved list.");
			 }
				dispatch(updateWorkfolioState({
					type : 'updateWorkfolioSaves', 
					savedData:{
						workfolio_id: workfolio_id,
						status:data.has_saved
						}
					}));
			
				dispatch(updateUserWorkfolioState({
					type : 'updateWorkfolioSaves',
					savedData:{
						workfolio_id: workfolio_id,
						status:data.has_saved
					} 
				}));
			
				dispatch(updateMyWorkfolioState({
					type : 'updateWorkfolioSaves',
					savedData:{
						workfolio_id: workfolio_id,
						status:data.has_saved
					}  
				}));
				
			 dispatch(updateSavedWorkfolioState({
					type : 'updateWorkfolioSaves',
					savedData:{
						workfolio_id: workfolio_id,
						status:data.has_saved
					}  
				}));
				
			 dispatch(updateFeedState({type : 'updateFeedSaves', savedData: {
					'has_saved':data.has_saved,
					'feed_id':workfolio_id,
					'feed_type':'workfolio',
				} }));
				
			 	setWorkfolioDetail(prev => ({
							...prev,  
							has_saved: data.has_saved  
					}));
		 
			
		 }
		 else
		 {
				setsubmitionMSG( 'Oops! Something went wrong.');
		 }
		 setShowModel(true);
			 
		
	},[authToken, workfolio_id]);;
	


	//function use to handle post delete
	const handleDeleteWorkfolio = useCallback(async()=>{
		setShowConfirm(false);
		if(workfolio_id == null || authToken==null)
		{
			return;
		}
		let data = await serverConnection(`/delete-workfolio`, {id: workfolio_id, }, authToken);
		  //console.log(data);
		 if(data.status == true)
		 {
				setsubmitionMSG( 'Work is deleted successfully.');
				setShowModel(true);
				setDeleted(true);
				//update   workfolio redux state (workfoliostate, userWorkfolioState ) and set deleted
				
		 }
		 else
		 {
				setsubmitionMSG( 'Oops! Something went wrong.');
				setShowModel(true); 
		 }
			 
	}, [authToken, workfolio_id]);
	
	
	// Close modal  
	const handleModalClose = useCallback((val) => {
		setShowModel(false);  
		if(deleted == true)
		{
			dispatch(updateMyWorkfolioState({type : 'deleteWorkfolio', workfolio_id: workfolio_id}));
				//dispatch(updateUserWorkfolioState({type : 'deleteWorkfolio', workfolio_id: workfolio_id}));
				//update local workfolio state
				setWorkfolioDetail(null);
		}
	
	},[dispatch, setShowModel, deleted, workfolio_id]);
	


	return ( 
		<>
			<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteWorkfolio}
        message="Are you sure you want to delete this workfolio."
        confirmLabel="Delete"
				/>
			
			<MessageAlert setShowModel={handleModalClose} showModel={showModel} message={submitionMSG}/>
			
			
			
			<div className=" w-100   h-auto d-flex   justify-content-between  align-items-start  RelativeContainer">
				<div className={`${(detail == false)&&'btn p-0 m-0 border-0 text-start'}`} onClick={handleNavigateWorkDetail}>
				{
					(detail ==  false) ?(	<h5 className="fw-semibold p-0 text-break">{title}</h5>):(	<h4  className="fw-semibold p-0 text-break">{title} </h4>)
				}
				
				</div>
				<div className="ps-3  "  > 
					<Dropdown className="   "> 
						 
								<Dropdown.Toggle variant="*" id={`workfolioDropDown${workfolio_id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
										<BsThreeDotsVertical />
								</Dropdown.Toggle>
					 
						 
						<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
							{ detail ==  false && 
								<Dropdown.Item as="button" variant="*" id={`gotToworkfolioDetail${workfolio_id}`}  title={`Work "${title}" detail `} className="py-2 mb-1 d-flex align-items-center gap-2   rounded navigation_link" onClick={handleNavigateWorkDetail}>
									<BsCardText   /> <span className="px-2">Detail </span>	  
								</Dropdown.Item>
							}
							
							{
								!chatBox &&
								<>
									<Dropdown.Item as="button" 
									variant="*" 
									id={`saveWorkfolioButton${workfolio_id}`}
									title={`${has_saved ? 'Saved' : 'Save'} work "${title}"`} 
									className={`py-2 mb-1 d-flex align-items-center gap-2   rounded navigation_link   ${has_saved && 'text-danger' }`} 
									onClick={handleWorkfolioSave}
									>
									{
										has_saved ?
										<>
											<BsBookmark  /> <span className="px-2">Saved </span>	
										</>
										:
										<>
											<BsBookmarkPlus  /> <span className="px-2">Save </span>	
										</>    
									}
											
									</Dropdown.Item>
							
							 					
									<Dropdown.Item as="button" variant="*" id={`shareWorkfolio${workfolio_id}`} title={`Share worlfolio ${workfolio_id}`}  className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleWorkfolioShare}>
											<BsShare   /> <span className="px-2">Share </span>	  
									</Dropdown.Item>
							 
							
									{
										logedUserData.id == user_id &&
										<>
											{/* Divider    */}
											<Dropdown.Divider />
											 
											<Dropdown.Item as="button" variant="*" id={`deleteWorkfolioButton${workfolio_id}`} title={`Delete work "${title}"`}  className="py-2 d-flex align-items-center gap-2   rounded exploreFilterClearBTN" onClick={() =>  setShowConfirm(true)}>
												<BsTrash3  /> <span className="px-2">Delete </span>	
											</Dropdown.Item>
										</>
									}
								</>
							}
						</Dropdown.Menu>
					</Dropdown>
				
				</div>
			</div>
		</>
	);
	
};

export default memo(WorkfolioHeader);
