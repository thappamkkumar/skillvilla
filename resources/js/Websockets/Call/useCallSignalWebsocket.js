import { useEffect, useRef } from "react"; 
import { updateChatCallState } from '../../StoreWrapper/Slice/ChatCallSlice';

const useCallSignalWebsocket = (loggedUserData, callId, handleOffer = ()=>{}, handleAnswer = ()=>{}, onICEConnection = ()=>{}) => {
  const userRef = useRef(loggedUserData?.id);
  

  useEffect(() => {
    if (loggedUserData?.id) {
      userRef.current = loggedUserData.id;
    }
  }, [loggedUserData]);

  useEffect(() => {
    if (!userRef.current) return;

    const channelName = `call.${userRef.current}`;
		 
    const callSignal_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('ChatCallSignalEvent', (e) => {
         
				   //  console.log("  call accept event:", e);
					if ( e.callId !== callId) return;
					if (e.type === 'offer') 
					{
						handleOffer(e.payload);
					}
					if (e.type === 'answer') 
					{
						handleAnswer(e.payload);
					}
					if (e.type === 'ice') 
					{
						onICEConnection(e.payload);
					}
					
					
        });
    };

    callSignal_connectWebSocket();
 
    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, loggedUserData ]);
};

export default useCallSignalWebsocket;
