import {useState, useEffect, useRef, useCallback } from "react";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useSelector,useDispatch } from 'react-redux';
import { BsTelephoneFill } from "react-icons/bs";

import MessageAlert from '../../../Components/MessageAlert';

import { updateChatState } from '../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
import serverConnection from '../../../CustomHook/serverConnection';  
import handleImageError from "../../../CustomHook/handleImageError";
import useWindowHeight from "../../../CustomHook/useWindowHeight";

const VideoCallModal = () => {
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
 
 
  if (chatCallData.callStatus !== "in-call" || chatCallData.callType != 'video') return null;

  return (
    <div className="fixed-top w-100   d-flex justify-content-center align-items-center call-container" style={{ height: windowHeight }}>
			
			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
      
			<div className="w-100 h-100 position-relative ">
			
				<Row className="h-100 g-0   ">
						{/* Remote video */}
						<Col xs={12} md={6} className="position-relative">
							<video
								className="w-100 h-100 object-fit-cover"
								autoPlay
								playsInline
								muted={false}
								id="remoteVideo"
								style={{ backgroundColor: "#000" }}
							></video>
						</Col>
						{/* Local video for large screen */}
						<Col xs={12} md={6} className="d-none d-md-block position-relative">
							<video
								className="w-100 h-100 object-fit-cover"
								autoPlay
								playsInline
								muted
								id="localVideo"
								style={{ backgroundColor: "#111" }}
							></video>
						</Col>
				</Row>
				{/* Local video for small screens */}
				
				<video
					className="d-md-none position-absolute"
					style={{
						width: "120px",
						height: "90px",
						bottom: "120px",
						right: "16px",
						borderRadius: "8px",
						backgroundColor: "#111",
					}}
					autoPlay
					muted
					playsInline
					id="localVideo"
				></video>
				
				{/* User name and time */}
				<div className="position-absolute top-0 start-0 p-3 text-white">
					<h5>{chatCallData.receiver?.name}</h5>
					<small>{chatCallData?.startedAt ? formatTime(elapsedTime) : "Connecting..."}</small>
				</div>
				
				{/* End Call Button */}
				<div className="position-absolute bottom-0 start-50 translate-middle-x mb-4">
					<Button
						variant="danger"
						id="endCallBTN"
						title="End Call"
						onClick={handleCallEnd}
						className="rounded-circle fs-5"
						disabled={callEndLoader}
						style={{ width: "65px", height: "65px" }}
					>
						{callEndLoader ? <Spinner size="sm" /> : <BsTelephoneFill className="fs-3" />}
					</Button>
				</div>
				
      </div>
			 
    </div>
  );
};

export default VideoCallModal;
