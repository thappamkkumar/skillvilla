import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateChatCallState } from '../../StoreWrapper/Slice/ChatCallSlice';

const useCallHoldWebsocket = (loggedUserData) => {
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
        .listen('ChatCallHoldEvent', (e) => {
         
				  // console.log("  call accept event:", e);
					
					const data = e.data;
					
					const holdData = {
						'callId' : data?.callId,
						'callerHold' : data?.callerHold,
						'receiverHold' : data?.receiverHold,
						
					}
					dispatch(updateChatCallState({'type' : 'holdCall', 'holdData':holdData } )); 
          
        });
    };

    incomingCall_connectWebSocket();
 
    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useCallHoldWebsocket;
