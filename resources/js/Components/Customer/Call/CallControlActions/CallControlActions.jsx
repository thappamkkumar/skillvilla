
import {  useState } from 'react';
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
import { useSelector } from 'react-redux';

import  SpeakerDevices  from './SpeakerDevices';

const CallControlActions = ({
	handleCallEnd,
	callEndLoader,
}) => {

	const chatCallData = useSelector((state) => state.chatCallData);
  const [showSpeakerModal, setShowSpeakerModal] = useState(false);
	
	
	
	return(
		<div  className="d-flex flex-column   align-items-center  " >
			
			<SpeakerDevices 
				show={showSpeakerModal}
        onClose={() => setShowSpeakerModal(false)}
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
					onClick={()=>{alert('change Camera')}}
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
					onClick={()=>{alert('change mic')}}
				>
					{
						chatCallData.isMuted ? <BsMicMute /> : <BsMic /> 
					}
				</Button>
				
				
				<Button 
					variant={chatCallData.isMuted ? "secondary" : "light"} 
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
					variant={chatCallData.isMuted ? "secondary" : "light"}  
					title="Hold Call" 
					id="holdControlBTN" 
					className="  border-0 shadow-none fs-4 p-2 lh-1       "
					onClick={()=>{alert('change hold call')}}
				>
					{
						chatCallData.isHold ? <BsPauseFill /> : <BsPause /> 
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