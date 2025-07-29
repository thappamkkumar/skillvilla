import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateChatCallState } from '../../StoreWrapper/Slice/ChatCallSlice';

const useIncomingCallWebsocket = (loggedUserData) => {
  const userRef = useRef(loggedUserData?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedUserData?.id) {
      userRef.current = loggedUserData.id;
    }
  }, [loggedUserData]);

  useEffect(() => {
    if (!userRef.current) return;

    const channelName = `call.${userRef.current}`;

    const incomingCall_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('ChatCallIncomingEvent', (e) => {
          console.log("Incoming call event:", e);

          
        });
    };

    incomingCall_connectWebSocket();
 
    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch,  ]);
};

export default useIncomingCallWebsocket;
