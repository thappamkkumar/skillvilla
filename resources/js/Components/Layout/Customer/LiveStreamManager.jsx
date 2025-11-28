import   {useCallback,  useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import LiveStreamModel from '../../Customer/LiveStream/LiveStreamModel'; 


//live stream functions
import startLiveStream from '../../Customer/LiveStream/LiveStreamFunctions/startLiveStream'; 
import handleOffer from '../../Customer/LiveStream/LiveStreamFunctions/handleOffer'; 
import handleAnswer from '../../Customer/LiveStream/LiveStreamFunctions/handleAnswer'; 
import handleICE from '../../Customer/LiveStream/LiveStreamFunctions/handleICE'; 

//live stream custom hook for websockets
import useLiveStreamStartWebsocket from '../../../Websockets/LiveStream/useLiveStreamStartWebsocket';
import useLiveStreamNewViewerWebsocket from '../../../Websockets/LiveStream/useLiveStreamNewViewerWebsocket';
import useLiveStreamSignalWebsocket from '../../../Websockets/LiveStream/useLiveStreamSignalWebsocket';
import useLiveStreamViewerLeaveWebsocket from '../../../Websockets/LiveStream/useLiveStreamViewerLeaveWebsocket';

const LiveStreamManager = () => {
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveStreamData = useSelector((state) => state.liveStreamData);
  const authToken = useSelector((state) => state.auth.token); 

	const ICE_CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }; 
	let peerConRef = useRef({}); 
	const publisherVideoRef  = useRef(null);  
	const localMediaRef  = useRef(null);  
	
	const dispatch  = useDispatch();
	
	
	const onStartLiveStream = useCallback(
		async (toUserId ) => {
			await startLiveStream(ICE_CONFIG, peerConRef, localMediaRef, authToken, liveStreamData,   toUserId,    dispatch);
		},
		[ICE_CONFIG, peerConRef, localMediaRef, authToken, liveStreamData,      dispatch]
	);
	
	const onOffer = useCallback(
		async (payload) => {
			await handleOffer(payload, ICE_CONFIG, peerConRef, publisherVideoRef,localMediaRef, authToken,  liveStreamData, logedUserData,  dispatch);
		},
		[ICE_CONFIG, peerConRef, publisherVideoRef, localMediaRef, authToken, liveStreamData, dispatch, logedUserData]
	);
	
	const onAnswer = useCallback(
		async (payload, viewerId) => {
			await handleAnswer(payload, viewerId, peerConRef);
		},
		[peerConRef]
	);
	
	
	const onICEConnection = useCallback(
		async (payload, viewerId) => {
			await handleICE(payload, viewerId, peerConRef);
		},
		[peerConRef]
	);
	
	
  // Call the websocket hook
  useLiveStreamStartWebsocket(logedUserData);
  useLiveStreamNewViewerWebsocket(logedUserData, liveStreamData, onStartLiveStream);
  useLiveStreamViewerLeaveWebsocket(logedUserData, liveStreamData);
  useLiveStreamSignalWebsocket(logedUserData, liveStreamData, onOffer, onAnswer, onICEConnection);
  
	
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
