import {useState, useEffect, useRef, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector,useDispatch } from 'react-redux';
import { BsTelephoneFill,  BsArrowsAngleContract, BsArrowsAngleExpand } from "react-icons/bs"; 

import CallControlActions from './CallControlActions/CallControlActions';
import MessageAlert from '../../../Components/MessageAlert';

import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';  
//import handleImageError from "../../../CustomHook/handleImageError";
import useWindowHeight from "../../../CustomHook/useWindowHeight";

const VideoCallModal = ({
	videoCallRef,
	localVideoRef,
	peerConRef,
}) => {
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); 
  const chatCallData = useSelector((state) => state.chatCallData);
  
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message 
	const [holdCallLoader, setHoldCallEndLoader] = useState(false);   
	const [callEndLoader, setCallEndLoader] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const [showUserManual, setShowUserManual] = useState(true);
	const [resizeScreen, setResizeScreen] = useState(false);
	
	const timerRef = useRef(null); 
	const hideTimerRef = useRef(null);
	

	const dispatch = useDispatch();
	const windowHeight = useWindowHeight();
	
  
	
	// Play remote audio (video element can still play audio)
	const playRemoteAudio = async (ref, sinkId = null) => {
		if (ref?.current) {
			try {
				if (sinkId && typeof ref.current.setSinkId === "function") {
					await ref.current.setSinkId(sinkId);
				}
				await ref.current.play();
			} catch (error) {
				console.warn("Video audio play/setSinkId failed:", error);
			}
		}
	};

	// Stop/mute remote audio
	const muteRemoteAudio = (ref) => {
		if (ref?.current) {
			ref.current.muted = true;
		}
	};
	const unmuteRemoteAudio = (ref) => {
		if (ref?.current) {
			ref.current.muted = false;
		}
	};
	
	//useEffect for mute or unmute audio and change speaker  of video call 
	useEffect(() => {
		const speakerId = chatCallData.speakerId || null;

		if (chatCallData.speakerOff) {
			muteRemoteAudio(videoCallRef);
		} else {
			unmuteRemoteAudio(videoCallRef);
			playRemoteAudio(videoCallRef, speakerId);
		}
	}, [chatCallData.speakerId, chatCallData.speakerOff]);


	
	//helper function for reset time for hide show call manuals
	const resetHideTimer = useCallback(() => {
		// Show controls
		setShowUserManual(true);

		// Clear existing timer
		if (hideTimerRef.current) clearTimeout(hideTimerRef.current);

		// Set timer to hide after 30s
		hideTimerRef.current = setTimeout(() => {
			setShowUserManual(false);
		}, 30000 );
	}, []);

	//useffect for set time to hide or show call manuals and use listeners
	useEffect(() => {
		// Start initial hide timer
		resetHideTimer();

		// Interaction events
		const events = ["mousemove", "mousedown", "click", "touchstart", "touchmove", "keydown"];
		events.forEach(evt => window.addEventListener(evt, resetHideTimer));

		return () => {
			events.forEach(evt => window.removeEventListener(evt, resetHideTimer));
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		};
	}, [resetHideTimer]);
	 
	
	// hleper function for calcucate accurate time from date  string
	const formatTime = (seconds) => {
		const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
		const secs = String(seconds % 60).padStart(2, "0");
		return `${mins}:${secs}`;
	};
	  
	//useEffect for start call duration timer
	useEffect(() => {
		if (!chatCallData?.startedAt) return;

		const startTime = new Date(chatCallData.startedAt).getTime();

		const updateTimer = () => {
			const now = Date.now();
			const elapsed = Math.floor((now - startTime) / 1000);
			setElapsedTime(elapsed > 0 ? elapsed : 0);
		};

		updateTimer(); // run once initially
		timerRef.current = setInterval(updateTimer, 1000);

		return () => clearInterval(timerRef.current);
	}, [chatCallData?.startedAt]);

	
	//handle call end
	const handleCallEnd = useCallback(async()=>{
		 
		try
		{
			setCallEndLoader(true);
			
			const resultData = await serverConnection('/call/end-or-reject', 
			{ 
				'call_id': chatCallData.callId,
				'chat_id': chatCallData.chatId,
				'status':'ended'
			}, authToken   ); 
			
			//console.log(resultData);
			
			if(resultData?.status )
			{
				setResizeScreen(false);//reset call container size
				
				dispatch(updateChatCallState({'type' : 'endCall', 'callId':chatCallData.callId } )); 
				
				const newMessage = resultData.newMessage
				
				if(logedUserData.id == newMessage.sender_id)
				{
					//add new mesage in chat list
					dispatch(updateChatState({type : 'AddNewMessage',  message:newMessage } ));  
					//move chat at top of list
					dispatch(updateChatState({type : 'updateChatAndMoveToTop',  chatId:newMessage.chat_list_id } ));  
					//add message in message list 
					dispatch(updateChatMessageState({type : 'AddNewMessage', newMessage:newMessage}));
					
				}
				if (peerConRef.current) {
					peerConRef.current.getSenders().forEach(s => {
						if (s.track) s.track.stop();
					});
					peerConRef.current.close();
					peerConRef.current = null;
				}
				
			}
			else
			{
				setsubmitionMSG(resultData.message || 'An error occurred. Please try again.');
				setShowModel(true);
			}
			
		}
		catch(e)
		{
			//console.log(e);
			 setsubmitionMSG('An error occurred. Please try again.');setShowModel(true);
		}
		finally
		{
			setCallEndLoader(false);
		}
		
		
	}, [authToken, chatCallData.callId]);
 
 
 //handle hold or unhold call
	const handleHoldCall = useCallback(async()=>{
		try
		{ 
			setHoldCallEndLoader(true);
			const resultData = await serverConnection('/call/hold', 
			{ 
				'call_id': chatCallData.callId, 
			}, authToken   ); 
			
			// console.log(resultData);
			
			if(resultData?.status )
			{
				const holdData = {
					'callId' : chatCallData.callId,
					'callerHold' : resultData?.caller_hold,
					'receiverHold' : resultData?.receiver_hold,
					
				}
				dispatch(updateChatCallState({'type' : 'holdCall', 'holdData':holdData } ));
				
				const isCurrentUserHolding =
								(holdData.callerHold && logedUserData.id === chatCallData.caller.id) ||
								(holdData.receiverHold && logedUserData.id === chatCallData.receiver.id);
								
				if (peerConRef?.current)
				{
					//hold or unhold input device
					peerConRef.current.getSenders().forEach(sender => {
						if (!sender.track) return; 
						if (isCurrentUserHolding) 
						{
								// Mute the track without stopping it
								sender.track.enabled = false;
								//console.log('stop input device');
						} 
						else 
						{
								// Unmute the track
								sender.track.enabled = true;
								//console.log('start input device');
						}
						
					});
					//hold or unhold output device
					peerConRef.current.getReceivers().forEach(receiver  => {
						if (!receiver.track) return; 
						if (isCurrentUserHolding) 
						{
								// Mute the track without stopping it
								receiver.track.enabled = false;
								//console.log('stop output device');
						} 
						else 
						{
								// Unmute the track
								receiver.track.enabled = true;
								//console.log('start output device');
						}
						
					});
					
					
				}
				
				
			}
			else
			{
				setsubmitionMSG(resultData.message || 'An error occurred. Please try again.');
				setShowModel(true);
			}
		}
		catch(e)
		{
			//console.log(e);
			submitionMSG('An error occurred. Please try again.');
			setShowModel(true);
		}
		finally
		{
			setHoldCallEndLoader(false);
		}
		
		  
	}, [dispatch, authToken, chatCallData, logedUserData]);
	
	
	//handle resize screen (small or large)
	const handleResize = useCallback(()=>{
		 
		setResizeScreen(pre => !pre);		
	}, []);
	
	
  if (chatCallData.callStatus !== "in-call" || chatCallData.callType != 'video') return null;
	
	 
	return(
		<div
			className={`position-fixed top-0 overflow-hidden  call-container ${resizeScreen && 'small-call-container end-0  m-1 rounded-3'} `}
			 style={!resizeScreen ? { height: windowHeight, width:'100%',  zIndex:900 } : { zIndex:900}}
		>
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			
			<div
				className="w-100 h-100 position-relative   "
			>
				<div
					className={`position-absolute     top-0 end-0 ${resizeScreen ? 'm-2' : 'm-3' } transition-opacity ${showUserManual ? 'opacity-100' : 'opacity-0'}`}
					id="resizeBTNContainer"
					style={{  transition: 'opacity 0.3s ease', zIndex:999 }}
				>
					<Button 
							variant="light"
							title="resize"
							id="audioCallResizebtn1"
							className="  "
							onClick={handleResize}
							size={`${resizeScreen ?'sm':'md' }`}
						> 
							{resizeScreen ? <BsArrowsAngleExpand />   : <BsArrowsAngleContract />  }
						</Button> 
				</div>
				
				
				{/*remote video*/}
				<div className="w-100 h-100 position-absolute z-1  ">
					<video  
						className="w-100 h-100 object-fit-cover   "
						ref={videoCallRef}
						autoPlay
						playsInline
						loop={true}
						muted={false} 
						style={{ backgroundColor: "#000" }}
					></video>
				</div>
				
				{/*actions and local video container*/}
				
				<div
					className={`position-absolute z-2 w-100 h-100   ${(  showUserManual) ? 'opacity-100  ' : 'opacity-0  '}`}
					id="userMannual"
					style={{ pointerEvents: showUserManual ? 'auto' : 'none', transition: 'opacity 0.3s ease' }}
				>
					<div className={`w-100 h-100  p-3   d-flex flex-column ${(!resizeScreen  ) ? 'opacity-100  ' : 'opacity-0  '}`}>
						<div className="flex-grow-1 text-white d-flex  flex-column justify-content-between">
							
							 	 
							<div >
								<div className="d-inline-block bg-dark bg-opacity-50   p-2 rounded">
									<h5>{chatCallData.receiver?.name}</h5>
									<small>{chatCallData?.startedAt ? formatTime(elapsedTime) : "wait..."}</small>
								</div> 
								{ 
									(chatCallData.callerHold || chatCallData.receiverHold)
									&& 
									 
										<p className="text-light  dot-blink mt-2"> 
											<strong  > On Hold </strong> 
										</p>
								 
								}
								{ 
									(chatCallData.isConnecting)
									&& 
										<p className="text-light   fw-bold     mt-2       "> 
										<strong  >  	Connecting
											<span className="dot-blink"> .</span>
											<span className="dot-blink">.</span>
											<span className="dot-blink">.</span>
										</strong> 
									</p>
								}
							</div>
							 
							
							{/*local video*/}
							<div className=" d-flex justify-content-end mb-4 mb-md-5 ">
								<div className="rounded overflow-hidden position-relative   local-video-container   ">
									<video 
										className="w-100 h-100 object-fit-cover   "
										style={{ backgroundColor: "#555" }}
										ref={localVideoRef}
										autoPlay
										muted
										playsInline 
										loop={true} 
									></video> 
									{ 
									((logedUserData.id == chatCallData.caller.id && chatCallData.callerHold) || 
										(logedUserData.id == chatCallData.receiver.id && chatCallData.receiverHold))
										&& 
										<div className="position-absolute top-0 start-0 w-100 h-100  y" style={{ backgroundColor: "#111" }}></div>
									
									}
								</div>	
							</div>
							
						</div>
						{/*control actions*/}
						<div className=" ">
							<CallControlActions 
								handleCallEnd={handleCallEnd}
								callEndLoader={callEndLoader}
								handleHoldCall={handleHoldCall}
								holdCallLoader={holdCallLoader}
								peerConRef={peerConRef}
								localVideoRef={localVideoRef}
							/>
							
						</div>
					</div> 
				</div>
				
				
				
			</div>
		</div>
	
	);
   
};

export default VideoCallModal;
