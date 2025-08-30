import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';

const attachConnectionStateHandlers = (peerConRef, dispatch) => {
  if (!peerConRef?.current) return;
	console.log('when failed connection end call. create separate function for end call and use in all view where needed')
  peerConRef.current.onconnectionstatechange = () => {
    const state = peerConRef.current.connectionState;
    //console.log("PeerConnection state:", state);

    if (state === "connecting") {
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: true }));
			dispatch(updateChatCallState({ type: "setError", error: null }));
    }

    if (state === "connected") {
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: false }));
    }

    if (state === "failed") {
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: false }));
      dispatch(updateChatCallState({ type: "setError", error: "  Connection failed." }));
    }

    if (state === "disconnected" || state === "closed") {
			dispatch(updateChatCallState({ type: "setError", error: "Call disconnected." }));
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: false }));
    }
  };
};

export default attachConnectionStateHandlers;
