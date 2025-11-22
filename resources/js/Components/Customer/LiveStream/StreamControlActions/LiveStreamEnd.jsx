
import {  useState, useCallback,memo  } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import Spinner from "react-bootstrap/Spinner";
import Dropdown from 'react-bootstrap/Dropdown';
import { 	
	BsPower ,
	BsThreeDotsVertical,
	BsBoxArrowRight,
	BsDoorOpen  
	} from "react-icons/bs";

import ConfirmDialog from '../../../ConfirmDialog';
import serverConnection from '../../../../CustomHook/serverConnection';

import {updateLiveStreamState} from '../../../../StoreWrapper/Slice/LiveStreamSlice';

const LiveStreamEnd = ({
	peerConRef,
	publisherVideoRef,
	localMediaRef,
	setShowModel,
	setsubmitionMSG
	
})=>{
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveStreamData = useSelector((state) => state.liveStreamData);
  const authToken = useSelector((state) => state.auth.token); 
	
	const [loading, setLoading] = useState(false);
	const [showConfirm, setShowConfirm] = useState(false);
	const [confirmAction, setConfirmAction] = useState(null); // action to perform after confirmation
	const [confirmMessage, setConfirmMessage] = useState("");

	const dispatch = useDispatch();	
	 
	
	// Generic confirm handler
	const handleConfirm = async () => {
		setShowConfirm(false);
		if (!confirmAction) return;

		setLoading(true);
		try {
			await confirmAction();
		} finally {
			setLoading(false);
		}
	};
	
	
	
	//end live stream by publisher 
	const endLiveStream = useCallback(async()=>{
			try 
			{ 
			
				let url = "/professional-live-stream-end";
				const requestData = {
					liveId: liveStreamData.liveId,					
				};
				if(liveStreamData.liveType == 'quick')
				{
					url = "/quick-live-stream-end";
				}
				
				const result = await serverConnection(url, requestData, authToken);
				
				//console.log(result);
				 
				if(result?.status === true)
				{
					dispatch(updateLiveStreamState(
						{ 
							'type':'refresh',   
						}
					)); 
					
					
					if (localMediaRef.current) { 
							localMediaRef.current.getTracks().forEach(track => track.stop());
							localMediaRef.current = null;
					}

					if(publisherVideoRef.current)
					{
						publisherVideoRef.current = null;
					}
					
					
					
					if (peerConRef.current && Object.keys(peerConRef.current).length > 0) {

						Object.values(peerConRef.current).forEach(peer => {

							// Stop all outgoing tracks
							peer.getSenders().forEach(sender => {
								if (sender.track) sender.track.stop();
							});

							// Close WebRTC connection
							try { 
								peer.close(); 
							} catch(e) {
								console.warn("Error closing peer:", e);
							}

						});

						// Clear all peers
						peerConRef.current = {};
					}

				}
				else
				{
					setsubmitionMSG(result?.message || 'Failed to end live stream. Please try again.');
					setShowModel(true);
				}
				
			} 
			catch (err) 
			{
				setsubmitionMSG('An error occurred. Please try again.');
				console.log('error:- ' + err);
				setShowModel(true);
			}
		
	},[authToken, liveStreamData,]);
	
	//leave live stream by viewer 
	const leaveLiveStream = useCallback(async()=>{
		
		try
		{
			let url = "/live-stream-viewer-leave";
			const requestData = {
					liveId: liveStreamData.liveId, 
				};
				
			const result = await serverConnection(url, requestData, authToken);
			
			 console.log(result);
			
			if(result?.status === true)
			{
				dispatch(updateLiveStreamState(
					{ 
						'type':'refresh',   
					}
				));
			
			}
			else
			{
				setsubmitionMSG(result?.message || 'Failed to leave live stream. Please try again.');
				setShowModel(true);
			}
				
			 
		}
		catch (err) 
		{
			setsubmitionMSG('An error occurred. Please try again.');
			console.log('error:- ' + e);
			setShowModel(true);
		}
		
	},[authToken, liveStreamData,]);
	
	
	//exit live stream as member by viewer 
	const exitLiveStream = useCallback(async()=>{
		
		try
		{
			let url = "/live-stream-member-exit";
			const requestData = {
					liveId: liveStreamData.liveId, 
				};
				
			const result = await serverConnection(url, requestData, authToken);
			
			 console.log(result);
			
			if(result?.status === true)
			{
				/*dispatch(updateLiveStreamState(
					{ 
						'type':'refresh',   
					}
				));*/
			}
		}
		catch (err) 
		{
			setsubmitionMSG('An error occurred. Please try again.');
			console.log('error:- ' + e);
			setShowModel(true);
		}
		
		
	},[authToken, liveStreamData,]);
	
	
	
	
	
	// Open confirm modal
	const openConfirm = (action, message) => {
		setConfirmAction(() => action);
		setConfirmMessage(message);
		setShowConfirm(true);
	};

	// Confirm dialog JSX
	const confirmDialog = (
		<ConfirmDialog 
			show={showConfirm}
			handleClose={() => setShowConfirm(false)}
			handleConfirm={handleConfirm}
			message={confirmMessage}
			confirmLabel="Confirm"
		/>
	);



	
	
	if(logedUserData?.id === liveStreamData?.publisher?.id)
	{
		return(
			<>
				{confirmDialog}
				<Button
					variant = "danger"
					title="End Live Stream"
					id="endLiveStream"
					className="rounded-circle  p-3 lh-1     fs-5 "
					onClick={() => openConfirm(endLiveStream, "Are you sure you want to end the live stream?")}
					disabled={loading}
				>
					{
						loading ? <Spinner  size="sm"/> : <BsPower      />
					} 
				</Button>
			</>
		);
	}
	else if(logedUserData?.id ===  liveStreamData?.currentViewer?.viewer_id && liveStreamData?.currentViewer?.is_sharing === true)
	{
		return(
			<>
				{confirmDialog}
				<Dropdown className="  "> 
					<Dropdown.Toggle 
						as="button"
						variant="danger" 
						id="ExitOrLeaveLiveStream"
						title="Exit Or Leave" 
						className="btn btn-danger border-0 rounded-circle     fs-5 p-3 lh-1  custom_dropdown_toggle_post_header "
					>
						{
							loading ? <Spinner  size="sm"/> : <BsBoxArrowRight      />
						}  
					</Dropdown.Toggle>
					
					<Dropdown.Menu 
						className="p-2 border-0 shadow dropdown_menu" 
						 
					>
						
						
						<Dropdown.Item
							as="button"
							variant="danger" 
							id="exitLiveStream" 
							title="Exit Live Stream As Member"  
							className="py-2 d-flex align-items-center gap-2    rounded navigation_link" 
							onClick={() => openConfirm(exitLiveStream, "Are you sure you want to exit as member?")}
							disabled={loading}
						> 
							{
								loading ? <Spinner  size="sm"/> : < BsDoorOpen     />
							} 
							<span className="ps-2">Exit </span>	  
						</Dropdown.Item>
						
						<Dropdown.Divider /> 
						
						<Dropdown.Item
							as="button"
							variant="light" 
							id="leaveLiveStream1" 
							title="Leave Live Stream"  
							className="py-2 d-flex align-items-center gap-2    rounded exploreFilterClearBTN" 
							onClick={() => openConfirm(leaveLiveStream, "Are you sure you want to leave the live stream?")}
							disabled={loading}
						> 
							{
								loading ? <Spinner  size="sm"/> : <BsBoxArrowRight      />
							} 
							<span className="ps-2">Leave </span>	  
						</Dropdown.Item>
					
					
					</Dropdown.Menu>
				</Dropdown>
			</>
		);
	}
	else if(logedUserData?.id ===  liveStreamData?.currentViewer?.viewer_id && liveStreamData?.currentViewer?.is_sharing === false) 
	{
		
		return(
			<>
				{confirmDialog}
				<Button
					variant = "danger"
					id="leaveLiveStream2" 
					title="Leave Live Stream"  
					className="rounded-circle  p-3 lh-1     fs-5 "
					onClick={() => openConfirm(leaveLiveStream, "Are you sure you want to leave the live stream?")}
					disabled={loading}
				>
					{
						loading ? <Spinner  size="sm"/> : <BsBoxArrowRight      />
					} 
				</Button>
			</>
		);
	}
	else
	{
		return null;
	}
	
	
};

export default memo(LiveStreamEnd);