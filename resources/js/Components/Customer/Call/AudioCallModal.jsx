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

const AudioCallModal = () => {
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); 
  const chatCallData = useSelector((state) => state.chatCallData);
  
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message   
	const [callEndLoader, setCallEndLoader] = useState(false);
	const [elapsedTime, setElapsedTime] = useState(0);
	const timerRef = useRef(null); 
	 
	const dispatch = useDispatch();
	const windowHeight = useWindowHeight();
	
  const backgroundImage = chatCallData.receiver?.image || "/images/profile_icon.png";

	 
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
 
 
  if (chatCallData.callStatus !== "in-call" || chatCallData.callType != 'audio') return null;

  return (
    <div className="fixed-top w-100   d-flex justify-content-center align-items-center call-container">
			
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
       
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
							<small>
								<strong>
									{chatCallData?.startedAt ? formatTime(elapsedTime) : "Calling"}
								</strong>
							</small>
						</p>

          </div>

          <div className="d-flex justify-content-center">
						<CallControlActions 
							handleCallEnd={handleCallEnd}
							callEndLoader={callEndLoader}
						/>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default AudioCallModal;
