import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateChatCallState } from '../../StoreWrapper/Slice/ChatCallSlice';

const useCallRestoreWebsocket = (loggedUserData, callId, startCall = ()=>{}) => {
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
		 
    const reStoreCall_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('ChatCallRestoreEvent', (e) => {
         
				  //console.log("  call restore event:", e);
					if(callId !== e.callId){
						return;
					}
					dispatch(updateChatCallState({'type' : 'setIsConnecting', 'isConnecting':true } ));
					
					if(!e.isCaller)
					{console.log('not Caller');
						return;
					}
					
					//call function for re-start or re-store connection via webRTC , refresh by receiver and call restart by caller
          startCall();
        });
    };

    reStoreCall_connectWebSocket();
 
    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useCallRestoreWebsocket;
