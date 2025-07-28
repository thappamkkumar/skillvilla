import {useState, useEffect, useRef, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { useSelector,useDispatch } from 'react-redux';
import { BsTelephoneFill } from "react-icons/bs";

import MessageAlert from '../../../Components/MessageAlert';
 
import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';  
import handleImageError from "../../../CustomHook/handleImageError";

const OutgoingCallModal = () => {
	
	const authToken = useSelector((state) => state.auth.token); 
  const chatCallData = useSelector((state) => state.chatCallData);
  
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message   
	const [CallEndLoader, setCallEndLoader] = useState(false);
	
	const audioRef = useRef(null);
	
	const dispatch = useDispatch();
	
	
  const backgroundImage = chatCallData.receiver?.image || "/images/profile_icon.png";

	//play audio only if calling
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (chatCallData.callStatus === "calling") {
      audio.play().catch(() => {
        console.warn("Autoplay failed. User interaction required.");
      });
    } else {
      audio.pause();
      audio.currentTime = 0;
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, [chatCallData.callStatus]);


	
	//handle call end
	const handleCallEnd = useCallback(()=>{
		setCallEndLoader(true);
		dispatch(updateChatCallState({'type' : 'refresh'} )); 
		setCallEndLoader(false);
	}, []);
 

  if (chatCallData.callStatus !== "calling") return null;

  return (
    <div className="fixed-top w-100 h-100 d-flex justify-content-center align-items-center call-container">
      <audio ref={audioRef} src="/audio/calling.mp3" loop />
      
      <div
        className="call-card caller-card"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="w-100 h-100 p-3 p-lg-5 d-flex flex-column caller-card-overlay">
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
							className="rounded-circle fs-5"
							disabled={CallEndLoader}
						>
							{
								CallEndLoader ? <Spinner  size="sm"/> : <BsTelephoneFill    />
							} 
               
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OutgoingCallModal;
