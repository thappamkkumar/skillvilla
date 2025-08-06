import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateChatCallState } from '../../StoreWrapper/Slice/ChatCallSlice';

const useCallAcceptWebsocket = (loggedUserData) => {
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
        .listen('ChatCallAcceptedEvent', (e) => {
         
				 // console.log("  call accept event:", e);
					
				 
					const callData = {
						'callId': e.callId,
						'startedAt': e.startedAt,
					};   
					dispatch(updateChatCallState({'type' : 'acceptCall', 'callData':callData } ));
          
        });
    };

    incomingCall_connectWebSocket();
 
    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useCallAcceptWebsocket;
