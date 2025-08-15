import {useState, useEffect, useRef, useCallback } from "react";

import { useSelector,useDispatch } from 'react-redux';
 
import CallControlActions from './CallControlActions/CallControlActions';
import MessageAlert from '../../../Components/MessageAlert';

import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';  
import handleImageError from "../../../CustomHook/handleImageError";
import useWindowHeight from "../../../CustomHook/useWindowHeight";

const AudioCallModal = ({
	audioCallRef,
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
	const timerRef = useRef(null); 
	 
	const dispatch = useDispatch();
	const windowHeight = useWindowHeight();
	
  
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
	
	//change device according to seleced device id
	useEffect(() => {
		const speakerId = chatCallData.speakerId || null;
		if(chatCallData.speakerOff)
		{
			stopAudio(audioCallRef);				
		}
		else
		{
			playAudio(audioCallRef, true, speakerId);
		}
	}, [chatCallData.speakerId, chatCallData.speakerOff]);
	 
	 
	 
	 
	const formatTime = (seconds) => {
		const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
		const secs = String(seconds % 60).padStart(2, "0");
		return `${mins}:${secs}`;
	};
	useEffect(() => {
    if (!chatCallData?.startedAt) return;

    const startTime = new Date(chatCallData.startedAt).getTime();

    const updateTimer = () => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedTime(elapsed > 0 ? elapsed : 0);
    };

    // Clear any existing interval
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }

    updateTimer(); // Run immediately
    timerRef.current = setInterval(updateTimer, 1000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [chatCallData?.startedAt]);

  const displayTime = chatCallData?.startedAt
    ? elapsedTime > 0
      ? formatTime(elapsedTime)
      : "wait..."
    : "Calling";

	
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
			console.log(e);
			 setsubmitionMSG('An error occurred. Please try again.');
			 setShowModel(true);
		}
		finally
		{
			setCallEndLoader(false);
		}
		
		
	}, [authToken, chatCallData.callId]);
 
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
			setsubmitionMSG('An error occurred. Please try again.');
			setShowModel(true);
		}
		finally
		{
			setHoldCallEndLoader(false);
		}
		
		  
	}, [dispatch, authToken, chatCallData, logedUserData]);
	
	
	
  if (chatCallData.callStatus !== "in-call" || chatCallData.callType != 'audio') return null;

  return (
    <div className="fixed-top w-100   d-flex justify-content-center align-items-center call-container" style={{ height: windowHeight }} >
			
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
      
			<audio ref={audioCallRef}   preload="auto"   />
       
        <div className="   p-3   d-flex flex-column call-card  "  >
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
							<small>
								<strong>{displayTime}</strong>
							</small>
						</p> 
						<p className="text-danger  "> 
								<strong> 
									{chatCallData.error}
								</strong> 
						</p>
						
						 
						{ 
							(chatCallData.callerHold || chatCallData.receiverHold)  
							&& 
							<p className="text-light dot-blink mb-5"> 
								<strong>On Hold </strong> 
							</p>
						}
						{ 
							(chatCallData.isConnecting  )  
							&& 
							<p className="text-light dot-blink  "> 
								<strong>  	Connecting... </strong> 
							</p>
						}
								 
          </div>

          <div className="d-flex justify-content-center">
						<CallControlActions 
							handleCallEnd={handleCallEnd}
							callEndLoader={callEndLoader}
							handleHoldCall={handleHoldCall}
							holdCallLoader={holdCallLoader}
							peerConRef={peerConRef}
						/>
            
          </div>
        </div>
       
    </div>
  );
};

export default AudioCallModal;
