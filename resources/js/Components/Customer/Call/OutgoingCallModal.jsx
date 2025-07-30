import {useState, useEffect, useRef, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector,useDispatch } from 'react-redux';
import { BsTelephoneFill } from "react-icons/bs";

import MessageAlert from '../../../Components/MessageAlert';

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
	
	const callingToneRef = useRef(null);
  const noResponseToneRef = useRef(null); 
  const autoEndTimeoutRef = useRef(null);
	
	const dispatch = useDispatch();
	const windowHeight = useWindowHeight();
	
  const backgroundImage = chatCallData.receiver?.image || "/images/profile_icon.png";

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
    if (chatCallData.callStatus === "calling") 
		{
      playAudio(callingToneRef, true);

      autoEndTimeoutRef.current = setTimeout(() => {
        setAutoEndTriggered(true);
        handleAutoEnd();
      }, 60000); // 1 min
    } else {
      stopAudio(callingToneRef);
      clearTimeout(autoEndTimeoutRef.current);
    }

    return () => {
      stopAudio(callingToneRef);
      clearTimeout(autoEndTimeoutRef.current);
    };
  }, [chatCallData.callStatus]);
	
	
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
			
			const resultData = await serverConnection('/end-call', 
			{ 
				'call_id': chatCallData.callId,
				'chat_id': chatCallData.chatId,
				'status':'Call Ended'
			}, authToken   ); 
			
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
			//console.log(e);
			 submitionMSG('An error occurred. Please try again.');setShowModel(true);
		}
		finally
		{
			setCallEndLoader(false);
		}
		
		
	}, [authToken, chatCallData.callId]);
 

  if (chatCallData.callStatus !== "calling") return null;

  return (
    <div className="fixed-top w-100   d-flex justify-content-center align-items-center call-container">
			
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
      <audio ref={callingToneRef} src="/audio/calling-indicator.mp3" loop />
      <audio ref={noResponseToneRef} src="/audio/busy-indicator.mp3" />
      
      <div
        className="call-card caller-card"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-100    p-3 p-lg-5 d-flex flex-column caller-card-overlay" style={{ height: windowHeight }} >
          <div className="flex-grow-1 d-flex flex-column justify-content-center align-items-center">
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
            <Button 
							variant="danger" 
							id="endCallBTN"
							title="End Call"
							onClick={handleCallEnd}
							className="rounded-circle fs-5  "
							disabled={callEndLoader}
							 style={{ width: "65px", height: "65px",  }}
						>
							{
								callEndLoader ? <Spinner  size="sm"/> : <BsTelephoneFill   className="fs-3"   />
							} 
               
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingCallModal;
