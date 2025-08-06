
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
	holdCall,
	holdCallLoader,
}) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const chatCallData = useSelector((state) => state.chatCallData);
  
	const [showSpeakerModal, setShowSpeakerModal] = useState(false);
  const [showMicModal, setShowMicModal] = useState(false);
  const [showCameraModal, setShowCameraModal] = useState(false);
	
	

	const dispatch = useDispatch();
	
 
	
	return(
		<div  className="d-flex flex-column   align-items-center  " >
			
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
				 
				
				
			<div 
				className="w-100  d-flex flex-wrap justify-content-center align-items-center gap-3   mb-4  " 
				 
			>
				
				{/* Call Mic Button*/}
				<Button 
					variant={chatCallData.cameraOn ? "light" : "secondary"}
					title="Camera Controll" 
					id="cameraControlBTN" 
					className="     fs-4 p-2 lh-1       "
					onClick={ () => setShowCameraModal(true)} 
				>
					{
						chatCallData.cameraOn ? <BsCameraVideo /> : <BsCameraVideoOff /> 
					}
				</Button>
				
				<Button 
					variant={chatCallData.isMuted ? "secondary" : "light"}  
					title="Mic Controll" 
					id="micControlBTN" 
					className="       fs-4 p-2 lh-1       "
					onClick={ () => setShowMicModal(true)} 
				>
					{
						chatCallData.isMuted ? <BsMicMute /> : <BsMic /> 
					}
				</Button>
				
				
				<Button 
					variant={chatCallData.speakerOff ? "secondary" : "light"} 
					title="Sound Controll" 
					id="soundControlBTN" 
					className="  border-0 shadow-none    fs-4 p-2 lh-1      "
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
					className={`  border-0 shadow-none p-2  ${ !holdCallLoader  && 	'lh-1     fs-4 '}   `}
					onClick={holdCall}
				>
					{
						holdCallLoader 
						? 
							<Spinner className="   m-1" size="sm"  />
						: 
						(
							 logedUserData.id == chatCallData.caller.id
                ? (chatCallData.callerHold ? <BsPauseFill /> : <BsPause />)
                : (chatCallData.receiverHold ? <BsPauseFill /> : <BsPause />)
						)
					}
					 
				</Button>
				
				
				
			</div>
			
			
			{/* Call End Button*/}
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
	);

};

export default CallControlActions;