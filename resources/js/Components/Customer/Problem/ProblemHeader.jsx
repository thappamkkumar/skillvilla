 

import   {memo, useState, useCallback, useEffect } from 'react';   

import { useNavigate } from 'react-router-dom';
import {useSelector, useDispatch } from 'react-redux'; 
import Button from 'react-bootstrap/Button';
import Dropdown from 'react-bootstrap/Dropdown';
 
import { BsThreeDotsVertical, BsTrash3, BsCardText, BsBookmark, BsBookmarkPlus, BsShare } from "react-icons/bs"; 
 
 
import {updateProblemState} from '../../../StoreWrapper/Slice/ProblemSlice';
import {updateProblemState as updateSavedProblemState} from '../../../StoreWrapper/Slice/SavedProblemSlice';
import {updateProblemState as updateMyProblemState} from '../../../StoreWrapper/Slice/MyProblemSlice';
import {updateProblemState as updateUserProblemState} from '../../../StoreWrapper/Slice/UserProblemSlice';
import { updateShareStatsState } from '../../../StoreWrapper/Slice/ShareStatsSlice';
import { updateFeedState } from '../../../StoreWrapper/Slice/FeedSlice';

import ConfirmDialog from '../../ConfirmDialog'; 
import MessageAlert from '../../MessageAlert'; 
import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';

const ProblemHeader = ({	
title,
user_id,
problem_id,
has_saved,
chatBox,
detail=false,
setProblemDetail=()=>{},
 } ) =>
{
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [showConfirm, setShowConfirm] = useState(false); 
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	const [deleted, setDeleted] = useState(false); //state for alert message  
	const dispatch = useDispatch();//geting reference of useDispatch into dispatch
	 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	 
	
	//handle navigate to work detail 
	const handleNavigateProblemDetail = useCallback(()=>
	{  
		if(detail == true)
		{ 
			return; 
		}
			manageVisitedUrl(`/problem-detail/${problem_id}`, 'append');
			navigate(`/problem-detail/${problem_id}`);
	},[problem_id]);
	
	
	
	//function use to handle problem share
	const handleProblemShare = useCallback(() =>
	{ 
		dispatch(updateShareStatsState({type : 'SetSelectedId', selectedId: problem_id}));
		dispatch(updateShareStatsState({type : 'SetSelectedFeature', selectedFeature: "problem"}));
		
	}, [problem_id]);
	
	//function for handle problem save
	const handleProblemSave = useCallback(async()=>{
		 
		if(problem_id == null || authToken == null)
		{
			return;
		}
		 
		let data = await serverConnection(`/save-problem`, {problem_id: problem_id}, authToken);
		   // console.log(data);
		 if(data && data.status == true)
		 {
			 if(data.has_saved == true)
			 {
					setsubmitionMSG( 'Problem has been saved successfully!');
			 }
			 else
			 {
				 setsubmitionMSG( "Problem has been removed from saved list.");
			 }
				dispatch(updateProblemState({
					type : 'updateProblemSaves', 
					savedData:{
						problem_id: problem_id,
						status:data.has_saved
						}
					}));
			
				dispatch(updateSavedProblemState({
					type : 'updateProblemSaves',
					savedData:{
						problem_id: problem_id,
						status:data.has_saved
					} 
				}));
			
				dispatch(updateMyProblemState({
					type : 'updateProblemSaves',
					savedData:{
						problem_id: problem_id,
						status:data.has_saved
					}  
				}));
				
			 dispatch(updateUserProblemState({
					type : 'updateProblemSaves',
					savedData:{
						problem_id: problem_id,
						status:data.has_saved
					}  
				}));
			 
			 dispatch(updateFeedState({type : 'updateFeedSaves', savedData: {
					'has_saved':data.has_saved,
					'feed_id':problem_id,
					'feed_type':'problem',
				} }));
				
			 	setProblemDetail(prev => ({
							...prev,  
							has_saved: data.has_saved  
					}));
		 
			
		 }
		 else
		 {
				setsubmitionMSG( 'Oops! Something went wrong.');
		 }
		 setShowModel(true);
			 
		
	},[authToken, problem_id]);;
	
	
	
	
	
	//function use to handle post delete
	const handleDeleteProblem = useCallback(async()=>{
		setShowConfirm(false);
		if(problem_id == null)
		{
			return;
		}
		
		try
		{	
			let data = await serverConnection(`/delete-problem`, {id: problem_id, }, authToken);
		  // console.log(data);
			if(data.status == true)
			{ 
				setsubmitionMSG('Problem is deleted successfully.');
				setShowModel(true);
				setDeleted(true);
				
			}
			else
			{
				setsubmitionMSG( 'Failed to delete the problem. Please try again.');
				setShowModel(true); 
			}
		} 
		catch (error)
		{
			 //console.error(error);
				setsubmitionMSG('An error occurred. Please try again.'); 
				setShowModel(true); 
		}		 
		
	}, [authToken, problem_id, , ]);
	
	// Close modal  
	const handleModalClose = useCallback((val) => {
		setShowModel(false);  
		if(deleted == true)
		{
			dispatch(updateMyProblemState({type : 'deleteProblem', problem_id: problem_id}));
				 
				//update local problem state
				setProblemDetail(null);
		}
	
	},[dispatch, setShowModel, deleted, problem_id]);
	
	return ( 
		<>
			<ConfirmDialog 
				show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteProblem}
        message="Are you sure you want to delete this problem."
        confirmLabel="Delete"
				/>
			<MessageAlert  showModel={showModel} setShowModel={handleModalClose} message={submitionMSG}/>
			
			<div className=" w-100 px-0 h-auto d-flex   justify-content-between  align-items-start  RelativeContainer">
				<div 
				className={`${(detail == false)&&'btn p-0 m-0 border-0 text-start'}`} onClick={handleNavigateProblemDetail}>
				{
					(detail ==  false) ?(	<h5 className="fw-semibold p-0 text-break">{title}</h5>):(	<h4  className="fw-semibold p-0 text-break">{title} </h4>)
				}
				
				</div>
				
				<div className="ps-3" > 
					<Dropdown className="   "> 
						  
							 
						<Dropdown.Toggle variant="*" id={`problemDropDownMenu${problem_id}`} title="more" className="border-0 p-1 custom_dropdown_toggle_post_header ">
						<BsThreeDotsVertical />
						</Dropdown.Toggle>
						 
							
						 
						<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}>
							{ detail ==  false && 
								<Dropdown.Item as="button" variant="*" id={`navigateToProblemDetail${problem_id}`} title={`Problem "${title}" detail `}  className="py-2 mb-1  d-flex align-items-center gap-2  rounded navigation_link" onClick={handleNavigateProblemDetail}>
									<BsCardText   /> <span className="px-2">Detail </span>	  
								</Dropdown.Item>
							}
							
							{
								!chatBox &&
								<>
									<Dropdown.Item as="button" 
									variant="*" 
									id={`saveProblemButton${problem_id}`}
									title={`${has_saved ? 'Saved' : 'Save'} problem  "`} 
									className={`py-2 mb-1 d-flex align-items-center gap-2   rounded navigation_link   ${has_saved && 'text-danger' }`} 
									onClick={handleProblemSave}
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
									
									 						
										<Dropdown.Item as="button" variant="*" id={`shareProblem${problem_id}`} title={`Share problem ${problem_id}`}  className="py-2 d-flex align-items-center gap-2    rounded navigation_link" onClick={handleProblemShare}>
												<BsShare   /> <span className="px-2">Share </span>	  
										</Dropdown.Item>
									 
									
									{
										logedUserData.id == user_id &&
										<>
											 
											{/* Divider    */}
											<Dropdown.Divider /> 
											<Dropdown.Item as="button" variant="*" id={`deleteProblemButton${problem_id}`}   title={`Delete Problem "${title}"`}  className="py-2  d-flex align-items-center  gap-2 rounded exploreFilterClearBTN" onClick={() =>  setShowConfirm(true)}>
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

export default memo(ProblemHeader);
