
import {  useState, useCallback } from 'react';
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";
import { 
	BsTelephoneFill, 
	BsMic, 
	BsMicMute, 
	BsCameraVideo, 
	BsCameraVideoOff,
	BsVolumeUp ,
	BsVolumeMute,
	BsPause,
	BsPauseFill,
  
} from "react-icons/bs";
import { useSelector, useDispatch } from 'react-redux';

import  SpeakerDevices  from './SpeakerDevices';
import  MicDevices  from './MicDevices';
import  CameraDevices  from './CameraDevices';


import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';

import serverConnection from '../../../../CustomHook/serverConnection';  


const CallControlActions = ({
	handleCallEnd,
	callEndLoader,
	handleHoldCall,
	holdCallLoader,
}) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const chatCallData = useSelector((state) => state.chatCallData);
  
	const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [showMicModal, setShowMicModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
	
	

	const dispatch = useDispatch();
	
 
	 
	return(
		<div  className=" d-flex flex-wrap justify-content-center align-items-center gap-3   mb-4  " >
			
			<SpeakerDevices 
				show={showSpeakerModal}
        onClose={() => setShowSpeakerModal(false)}
			/> 
			<MicDevices 
				show={showMicModal}
        onClose={() => setShowMicModal(false)}
			/> 
			<CameraDevices 
				show={showCameraModal}
        onClose={() => setShowCameraModal(false)}
			/> 
			 
				
				{/* Call Mic Button*/}
				<Button 
					variant={chatCallData.cameraOn ? "light" : "secondary"}
					title="Camera Controll" 
					id="cameraControlBTN" 
					className={` ${chatCallData.callType === 'audio' ? 'd-none' : 'd-block'} rounded-circle    fs-5 p-3  lh-1       `}
					onClick={ () => setShowCameraModal(true)}
					disabled = {(chatCallData.callStatus === 'calling')  }
				>
					{
						chatCallData.cameraOn ? <BsCameraVideo /> : <BsCameraVideoOff /> 
					}
				</Button>
				
				<Button 
					variant={chatCallData.isMuted ? "secondary" : "light"}  
					title="Mic Controll" 
					id="micControlBTN" 
					className="   rounded-circle     fs-5 p-3 lh-1       "
					onClick={ () => setShowMicModal(true)} 
					disabled = {chatCallData.callStatus === 'calling'}
				>
					{
						chatCallData.isMuted ? <BsMicMute /> : <BsMic /> 
					}
				</Button>
				
				
				<Button 
					variant={chatCallData.speakerOff ? "secondary" : "light"} 
					title="Sound Controll" 
					id="soundControlBTN" 
					className="  rounded-circle     fs-5 p-3 lh-1      "
					onClick={ () => setShowSpeakerModal(true)} 
				>
					{
						chatCallData.speakerOff ? <BsVolumeMute /> : <BsVolumeUp /> 
					}
				</Button>
				
				<Button 
					variant={
										(logedUserData.id == chatCallData.caller.id && chatCallData.callerHold) || 
										(logedUserData.id == chatCallData.receiver.id && chatCallData.receiverHold)
													? "secondary"
													: "light"
									}
					title="Hold Call" 
					id="holdControlBTN" 
					className="  rounded-circle   p-3 lh-1     fs-5   "
					onClick={handleHoldCall}
					disabled = {chatCallData.callStatus === 'calling'}
				>
					{
						holdCallLoader 
						? 
							<Spinner className="    " size="sm"  />
						: 
						(
							 logedUserData.id == chatCallData.caller.id
                ? (chatCallData.callerHold ? <BsPauseFill /> : <BsPause />)
                : (chatCallData.receiverHold ? <BsPauseFill /> : <BsPause />)
						)
					}
					 
				</Button>
				
				
				
			 
			
			
			{/* Call End Button*/}
			<Button 
				variant="danger" 
				id="endCallBTN"
				title="End Call"
				onClick={handleCallEnd}
				className="rounded-circle  p-3 lh-1     fs-5  "
				disabled={callEndLoader}
				 
			>
				{
					callEndLoader ? <Spinner  size="sm"/> : <BsTelephoneFill    />
				} 
				 
			</Button>
		</div>
	);

};

export default CallControlActions;