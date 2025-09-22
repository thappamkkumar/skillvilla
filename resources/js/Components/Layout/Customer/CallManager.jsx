import   {   useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

//call components
import OutgoingCallModal from '../../Customer/Call/OutgoingCallModal';
import IncomingCallModal from '../../Customer/Call/IncomingCallModal'; 
import AudioCallModal from '../../Customer/Call/AudioCallModal'; 
import VideoCallModal from '../../Customer/Call/VideoCallModal'; 

//call functions
import startCall from '../../Customer/Call/CallFunctions/startCall'; 
import handleOffer from '../../Customer/Call/CallFunctions/handleOffer'; 
import handleAnswer from '../../Customer/Call/CallFunctions/handleAnswer'; 
import handleICE from '../../Customer/Call/CallFunctions/handleICE'; 


import serverConnection from '../../../CustomHook/serverConnection';

//call websockets
import useIncomingCallWebsocket from '../../../Websockets/Call/useIncomingCallWebsocket'; 
import useCallEndWebsocket from '../../../Websockets/Call/useCallEndWebsocket'; 
import useCallAcceptWebsocket from '../../../Websockets/Call/useCallAcceptWebsocket'; 
import useCallRestoreWebsocket from '../../../Websockets/Call/useCallRestoreWebsocket'; 
import useCallHoldWebsocket from '../../../Websockets/Call/useCallHoldWebsocket'; 
import useCallSignalWebsocket from '../../../Websockets/Call/useCallSignalWebsocket';


import { updateChatCallState } from '../../../StoreWrapper/Slice/ChatCallSlice';
 
 
 
const CallManager = () => {
	
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const authToken = useSelector((state) => state.auth.token); 
	const chatCallData = useSelector((state) => state.chatCallData);
  
	const dispatch = useDispatch();	
 
 //webrtc
	const ICE_CONFIG = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] }; 
	let peerConRef = useRef(null); 
	const audioCallRef = useRef(null);//ref for audio tag  for audio call
	const videoCallRef = useRef(null);//ref for video tag  for video call
	const localVideoRef  = useRef(null);//ref for local video tag  for video call
	
	
	
	const onOffer = useCallback(
		async (payload) => {
			await handleOffer(payload, ICE_CONFIG, peerConRef, audioCallRef, videoCallRef, localVideoRef, authToken, logedUserData, chatCallData, dispatch);
		},
		[ICE_CONFIG, peerConRef, audioCallRef,  videoCallRef, localVideoRef, authToken, logedUserData, chatCallData, dispatch]
	);

	const onAnswer = useCallback(
		async (payload) => {
			await handleAnswer(payload, peerConRef);
		},
		[peerConRef]
	);
	
	const onICEConnection = useCallback(
		async (payload) => {
			await handleICE(payload, peerConRef);
		},
		[peerConRef]
	);

 const onStartCall = useCallback(
		async ( ) => {
			await startCall(ICE_CONFIG, peerConRef, audioCallRef, videoCallRef, localVideoRef, authToken, logedUserData, chatCallData, dispatch);
		},
		[ICE_CONFIG, peerConRef, audioCallRef, videoCallRef, localVideoRef, authToken, logedUserData, chatCallData, dispatch   ]
	);

	const onReStartCall = useCallback(
		async (callData) => {
			await startCall(ICE_CONFIG, peerConRef, audioCallRef, videoCallRef, localVideoRef, authToken, logedUserData, callData, dispatch);
		},
		[ICE_CONFIG, peerConRef, audioCallRef, videoCallRef, localVideoRef, authToken,logedUserData,  dispatch]
	);
 
	//call hook for call websockets
	useIncomingCallWebsocket(logedUserData);
	useCallEndWebsocket(logedUserData, peerConRef); 
	useCallHoldWebsocket(logedUserData); 
	useCallAcceptWebsocket(logedUserData, chatCallData.callId	, onStartCall, ); 
	useCallRestoreWebsocket(logedUserData, chatCallData.callId	, onStartCall, ); 
	useCallSignalWebsocket(	logedUserData,	chatCallData.callId	,	 onOffer, onAnswer, onICEConnection ); 
  
	
	/**
	* Restore active call state on refresh
	*/
	useEffect(() => {
		if (!authToken) return;
		
		
		const restoreCallState = async () => {
			try 
			{
				const res = await serverConnection('/call/active', {}, authToken);
				//console.log(res);
				if (!res?.status || !res.data) 
				{
					dispatch(updateChatCallState({ type: 'refresh' }));
					return;
				}
				const { call_status, is_receiver, ...data } = res.data;
				const incomingCallData = is_receiver ? res.data : null;


				const baseCallData = {
					chatId: data.chat_id,
					callId: data.call_id,
					callType: data.call_type,
					startedAt: data.started_at,
					initiatedAt: data.initiated_at,
					callRoomId: data.room_id,
					callerHold: data.caller_hold,
					receiverHold: data.receiver_hold,
					caller: data.caller,
					receiver: data.receiver,
					incomingCallData,
				};
				 
				if (call_status === 'initiated') 
				{
					dispatch(
						updateChatCallState({
							type: 'setActiveCallData',
							callData: {
								...baseCallData,
								callStatus: is_receiver ? 'incoming' : 'calling',
							},
						})
					);
				}
				if (call_status === 'accepted') 
				{
					dispatch(
						updateChatCallState({
							type: 'setActiveCallData',
							callData: {
								...baseCallData,
								callStatus: 'in-call',
								isConnecting: true,
							},
						})
					);
					
					
					
				}
				if (call_status === 'accepted' && !is_receiver) 
				{
					
					onReStartCall({
								...baseCallData,
								callStatus: 'in-call',
								isConnecting: true,
							});
				}
			} 
			catch (err) 
			{
				console.error('Error restoring call state:');
			}
		};	
				
		
		restoreCallState();
	}, [authToken, dispatch]); 

   
   return (
    <>
				{/*outgoing call model*/}
				<OutgoingCallModal  />
				{/*incoming call model*/}
				<IncomingCallModal  />
				{/*Audio In-call model*/}
				<AudioCallModal audioCallRef = {audioCallRef} peerConRef={peerConRef} />
				{/*Video In-call model*/}
				<VideoCallModal  videoCallRef = {videoCallRef} localVideoRef={localVideoRef} peerConRef={peerConRef}  />
			
		</>
	);
};

export default CallManager;
