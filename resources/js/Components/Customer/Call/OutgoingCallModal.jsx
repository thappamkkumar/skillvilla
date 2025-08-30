import {useState, useEffect, useRef, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector,useDispatch } from 'react-redux';
import { BsTelephoneFill, BsArrowsAngleContract, BsArrowsAngleExpand 	  } from "react-icons/bs";

import MessageAlert from '../../../Components/MessageAlert';
import CallControlActions from './CallControlActions/CallControlActions';

import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';  
import handleImageError from "../../../CustomHook/handleImageError";
import useWindowHeight from "../../../CustomHook/useWindowHeight";

const OutgoingCallModal = () => {
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); 
  const chatCallData = useSelector((state) => state.chatCallData);
  
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message   
	const [callEndLoader, setCallEndLoader] = useState(false);
	const [autoEndTriggered, setAutoEndTriggered] = useState(false);
	const [resizeScreen, setResizeScreen] = useState(false);
	
	const callingToneRef = useRef(null);
  const noResponseToneRef = useRef(null); 
  const autoEndTimeoutRef = useRef(null);
	
	const dispatch = useDispatch();
	const windowHeight = useWindowHeight();
	
  

	// Helper: Play audio safely
  /*const playAudio = (ref, loop = false) => {
    if (ref?.current) {
      ref.current.loop = loop;
      ref.current.play().catch(() => {
        console.warn("Autoplay failed. User interaction required.");
      });
    }
  };*/
	// Helper: Play audio safely with optional sinkId (speaker)
const playAudio = async (ref, loop = false, sinkId = null) => {
  if (ref?.current) {
    try {
      ref.current.loop = loop;

      // Set output device if supported
      if (sinkId && typeof ref.current.setSinkId === "function") {
        await ref.current.setSinkId(sinkId);
      }

			//play audio tone
      await ref.current.play();
    } catch (error) {
      console.warn("Audio play/setSinkId failed:", error);
    }
  }
};


  // Helper: Stop audio safely
  const stopAudio = (ref) => {
    if (ref?.current) {
      ref.current.pause();
      ref.current.currentTime = 0;
    }
  };
	
	
	
	// Effect: Handle calling tone and auto-end
  useEffect(() => {
		const speakerId = chatCallData.speakerId || null;
		
    if (chatCallData.callStatus === "calling") 
		{
			if(chatCallData.speakerOff)
			{
				stopAudio(callingToneRef);				
			}
			else
			{
				playAudio(callingToneRef, true, speakerId);
			}
      let timeoutDuration = 0; // default: 1 min in ms

			if (chatCallData.initiatedAt) {
				const initiatedTime = new Date(chatCallData.initiatedAt).getTime();
				const currentTime = new Date().getTime();

				if (!isNaN(initiatedTime)) {
					const diffInMs = 2 * 60 * 1000 - (currentTime - initiatedTime); // 2 mins from initiatedAt
					timeoutDuration = diffInMs > 0 ? diffInMs : 0;
				}
			}
			 
      if (timeoutDuration <= 0) 
			{
				// Already expired
				setAutoEndTriggered(true);
				handleAutoEnd();
			} 
			else 
			{
				autoEndTimeoutRef.current = setTimeout(() => {
					setAutoEndTriggered(true);
					handleAutoEnd();
				}, timeoutDuration);
			} 
    } else {
      stopAudio(callingToneRef);
      clearTimeout(autoEndTimeoutRef.current);
    }

    return () => {
      stopAudio(callingToneRef);
      clearTimeout(autoEndTimeoutRef.current);
    };
  }, [chatCallData.callStatus, chatCallData.initiatedAt, chatCallData.speakerId, chatCallData.speakerOff]);
	
	
	// Handle auto-end due to no response
  const handleAutoEnd = () => {
    stopAudio(callingToneRef);
    playAudio(noResponseToneRef);

    // After tone plays, dispatch missed call
    setTimeout(() => {
			stopAudio(noResponseToneRef);
       handleCallEnd();
    }, 4000);
  };
	
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
			 submitionMSG('An error occurred. Please try again.');setShowModel(true);
		}
		finally
		{
			setCallEndLoader(false);
		}
		
		
	}, [authToken, chatCallData.callId]);
 
	
	
	//handle resize screen (small or large)
	const handleResize = useCallback(()=>{
		 
		setResizeScreen(pre => !pre);		
	}, []);
	
  if (chatCallData.callStatus !== "calling") return null;
	
	return(
		<>
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			<audio ref={callingToneRef} src="/audio/calling-indicator.mp3" loop />
			<audio ref={noResponseToneRef} src="/audio/busy-indicator.mp3" />
      
			{
				!resizeScreen && 
				
				<div className="fixed-top w-100  call-container  " style={{ height: windowHeight }}>
					<div 
						className="w-100 h-100 position-relative  d-flex justify-content-center align-items-center "
					>
						<Button 
							variant="light"
							title="resize"
							id="outgoingCallResizebtn1"
							className="position-absolute   top-0 end-0 m-3"
							onClick={handleResize}
						> 
							<BsArrowsAngleContract />  
						</Button>
						
						<div className="   p-3   d-flex flex-column call-card "   >
							<div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center  ">
								<img
									src={chatCallData.receiver?.image || "/images/profile_icon.png"}
									alt="User Avatar"
									className="rounded-circle img-fluid outgoing-call-avatar mb-3"
									onError={(event) => {
										handleImageError(event, "/images/profile_icon.png");
									}}
								/>
								<h5 className="fw-semibold text-white">
									<strong>{chatCallData.receiver?.name}</strong>
								</h5>
								<p className="text-light">
									<small><strong>Calling</strong></small>
									<span className="dot-blink">.</span>
									<span className="dot-blink">.</span>
									<span className="dot-blink">.</span>
								</p>
							</div>

							<div className="d-flex justify-content-center">
								<CallControlActions 
									handleCallEnd={handleCallEnd}
									callEndLoader={callEndLoader}
									handleHoldCall={()=>{}}
									holdCallLoader={false}
								/>
								 
							</div>
						</div>
								
					</div>
				</div>
				
			}
			
			{
				resizeScreen && 
				<div className="position-fixed top-0 end-0 z-3 m-1 rounded-3   call-container small-call-container "  >
					<div
						className="w-100 h-100 position-relative d-flex justify-content-center align-items-center"
					>
						<Button 
							variant="light"
							title="resize"
							id="outgoingCallResizebtn1"
							className="position-absolute top-0 end-0 m-2  "
							onClick={handleResize}
							size="sm"
						> 
							<BsArrowsAngleExpand />  
						</Button>
						
						<img
							src={chatCallData.receiver?.image || "/images/profile_icon.png"}
							alt="User Avatar"
							className="rounded-circle img-fluid small-outgoing-call-avatar  "
							onError={(event) => {
								handleImageError(event, "/images/profile_icon.png");
							}}
						/>
					</div>
				</div>
			}
			
		</>
	);
   
};

export default OutgoingCallModal;
