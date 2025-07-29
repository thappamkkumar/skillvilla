import  { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";
import { useSelector,useDispatch } from 'react-redux';

import { BsTelephoneFill, BsX } from "react-icons/bs";

import MessageAlert from '../../../Components/MessageAlert';

import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';  
import handleImageError from "../../../CustomHook/handleImageError";
import useWindowHeight from "../../../CustomHook/useWindowHeight";

const IncomingCallModal = () => {
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); 
  const chatCallData = useSelector((state) => state.chatCallData);
  
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message   
	
	const [callRejectLoader, setCallRejectLoader] = useState(false);
	const [callAcceptLoader, setCallAcceptLoader] = useState(false);
	const [autoEndTriggered, setAutoEndTriggered] = useState(false);
	
	const incomingCallToneRef = useRef(null);
	const autoEndTimeoutRef = useRef(null);
	
	const dispatch = useDispatch();
	const windowHeight = useWindowHeight();
	
	const backgroundImage = chatCallData.caller?.image || "/images/profile_icon.png";
	
	// Helper: Play audio safely
  const playAudio = (ref, loop = false) => {
    if (ref?.current) {
      ref.current.loop = loop;
      ref.current.play().catch(() => {
        console.warn("Autoplay failed. User interaction required.");
      });
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
    if (chatCallData.callStatus === "incoming") 
		{ 
      playAudio(incomingCallToneRef, true);

      autoEndTimeoutRef.current = setTimeout(() => {
        setAutoEndTriggered(true);
        handleAutoEnd();
      }, 60000); // 1 min
    } else {
      stopAudio(incomingCallToneRef);
      clearTimeout(autoEndTimeoutRef.current);
    }

    return () => {
      stopAudio(incomingCallToneRef);
      clearTimeout(autoEndTimeoutRef.current);
    };
  }, [chatCallData.callStatus]);
	
	// Handle auto-end due to no response
  const handleAutoEnd = () => {
    stopAudio(incomingCallToneRef); 
    handleCallEnd();
     
  };
	
	//handle call end or reject
	const handleCallEnd = useCallback(async(status, statusType)=>{
		 
		try
		{
			setCallEndLoader(true);
			
			const resultData = await serverConnection('/end-call', 
			{ 'call_id': chatCallData.callId, 'status':'Call Ended'}, authToken   ); 
			
			//console.log(resultData);
			
			if(resultData?.status )
			{
				
				dispatch(updateChatCallState({'type' : 'endCall'} )); 
				
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
			console.log(e);
			tsubmitionMSG('An error occurred. Please try again.');setShowModel(true);
		}
		finally
		{
			setCallEndLoader(false);
		}
		
		
	}, [authToken, chatCallData.callId]);
	
	
	//function for reject call
	const handleCallReject = useCallback(async( )=>{
		 
		try
		{
			
		}
		catch(e)
		{
			console.log(e);
			submitionMSG('An error occurred. Please try again.');setShowModel(true);
		}
		finally
		{
			 
		}
		
		
	}, [authToken, chatCallData.callId]);
	
	//function for accept call
	const handleCallAccept = useCallback(async( )=>{
		 
		try
		{
			
		}
		catch(e)
		{
			console.log(e);
			submitionMSG('An error occurred. Please try again.');setShowModel(true);
		}
		finally
		{
			 
		}
		
		
	}, [authToken, chatCallData.callId]);
	
	if (chatCallData.callStatus !== "incoming") return null;
	
  return (
    <div className="fixed-top w-100 h-100 d-flex justify-content-center align-items-center bg-dark bg-opacity-75">
      <MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
      <audio ref={incomingCallToneRef} src="/audio/incoming-call-indicator.mp3" loop />
			<div
        className="call-card caller-card"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-100    p-3 p-lg-5 d-flex flex-column caller-card-overlay" style={{ height: windowHeight }} >
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
            <img
              src={chatCallData.caller?.image || "/images/profile_icon.png"}
              alt="User Avatar"
              className="rounded-circle img-fluid outgoing-call-avatar mb-3"
              onError={(event) => {
                handleImageError(event, "/images/profile_icon.png");
              }}
            />
            <h5 className="fw-semibold text-white">
              <strong>{chatCallData?.caller?.name || "Unknown Caller"}</strong>
            </h5>
            <p className="text-light">
              <small><strong>Calling</strong></small>
              <span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
              <span className="dot-blink">.</span>
            </p>
          </div>

          <div className="d-flex justify-content-between">
            <Button 
							variant="danger" 
							id="endCallBTN"
							title="End Call"
							onClick={handleCallReject }
							className="rounded-circle text-center "
							disabled={callRejectLoader}
							 style={{ width: "65px", height: "65px",  }}
						>
							{
								callRejectLoader ? <Spinner  size="sm"/> : <BsX     style={{ strokeWidth: '1', fontSize:'2.3rem',   }}     />
							} 
               
            </Button>
						
						<Button 
							variant="success" 
							id="endCallBTN"
							title="End Call"
							onClick={handleCallAccept}
							className="rounded-circle fs-5  "
							disabled={callAcceptLoader}
							 style={{ width: "65px", height: "65px",  }}
						>
							{
								callAcceptLoader ? <Spinner  size="sm"/> : <BsTelephoneFill   className="fs-3"   />
							} 
               
            </Button>
          </div>
        </div>
      </div>
			
    </div>
  );
};

export default IncomingCallModal;
