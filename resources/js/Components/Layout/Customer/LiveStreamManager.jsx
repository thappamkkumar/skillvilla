import   {  useRef} from 'react';
import { useSelector } from 'react-redux';
import LiveStreamModel from '../../Customer/LiveStream/LiveStreamModel'; 


import useLiveStreamStartWebsocket from '../../../Websockets/LiveStream/useLiveStreamStartWebsocket';

const LiveStreamManager = () => {
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	const ICE_CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }; 
	let peerConRef = useRef(null); 
	const publisherVideoRef  = useRef(null);  
	const localMediaRef  = useRef(null);  
	
  // Call the websocket hook
  useLiveStreamStartWebsocket(logedUserData);
 
 // return null if no live stream start
	if(liveStreamData.liveStatus === 'idle') return null;
	
  return(
		<>
			<LiveStreamModel  	
				peerConRef = {peerConRef}	
				publisherVideoRef = {publisherVideoRef}	
				localMediaRef = {localMediaRef}	
			/>
			
		</>
	);
};

export default LiveStreamManager;
