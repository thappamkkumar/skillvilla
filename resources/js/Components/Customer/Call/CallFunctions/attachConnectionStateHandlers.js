import { updateChatState } from '../../../../StoreWrapper/Slice/ChatSlice';
import { updateChatMessageState } from '../../../../StoreWrapper/Slice/ChatMessageSlice';
import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';
import serverConnection from '../../../../CustomHook/serverConnection';

const handleCallEnd = async (peerConRef, authToken, logedUserData, chatCallData, dispatch) => {
  try {
    const resultData = await serverConnection(
      '/call/end-or-reject',
      { 
        call_id: chatCallData.callId,
        chat_id: chatCallData.chatId,
        status: 'ended'
      },
      authToken
    );
    //console.log(resultData);

    if (resultData?.status) {
      dispatch(updateChatCallState({ type: 'endCall', callId: chatCallData.callId }));

      const newMessage = resultData.newMessage;

      if (logedUserData.id === newMessage.sender_id) {
        // add new message in chat list
        dispatch(updateChatState({ type: 'AddNewMessage', message: newMessage }));
        // move chat at top of list
        dispatch(updateChatState({ type: 'updateChatAndMoveToTop', chatId: newMessage.chat_list_id }));
        // add message in message list
        dispatch(updateChatMessageState({ type: 'AddNewMessage', newMessage }));
      }

      if (peerConRef?.current) {
        peerConRef.current.getSenders().forEach((s) => {
          if (s.track) s.track.stop();
        });
        peerConRef.current.close();
        peerConRef.current = null;
      }
    }
  } catch (e) {
    //console.log(e);
  }
};

let endCallTimeout = null; // store timeout globally in module

const attachConnectionStateHandlers = (peerConRef, authToken, logedUserData, chatCallData, dispatch) => {
  if (!peerConRef?.current) return;

  peerConRef.current.onconnectionstatechange = () => {
    const state = peerConRef.current.connectionState;
    //console.log("PeerConnection state:", state);

    if (state === "connecting") {
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: true }));
      dispatch(updateChatCallState({ type: "setError", error: null }));
    }

    if (state === "connected") {
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: false }));
      // if connection is back, clear pending call end
      if (endCallTimeout) {
        clearTimeout(endCallTimeout);
        endCallTimeout = null;
      }
    }

    if (state === "failed" || state === "disconnected") {
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: false }));
      dispatch(updateChatCallState({ type: "setError", error: "Connection issue detected. Trying to recover..." }));

      // Start a 2-minute timeout before ending the call
      if (!endCallTimeout) {
        endCallTimeout = setTimeout(() => {
          handleCallEnd(peerConRef, authToken, logedUserData, chatCallData, dispatch);
          endCallTimeout = null;
        }, 2 * 60 * 1000); // 2 minutes
      }
    }

    if (state === "closed") {
      dispatch(updateChatCallState({ type: "setIsConnecting", isConnecting: false }));
      dispatch(updateChatCallState({ type: "setError", error: "Call closed." }));
    }
  };
};

export default attachConnectionStateHandlers;
