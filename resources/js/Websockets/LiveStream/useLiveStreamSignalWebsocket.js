import { useEffect, useRef } from "react"; 
 
const useLiveStreamSignalWebsocket = (loggedUserData, liveStreamData, handleOffer = ()=>{}, handleAnswer = ()=>{}, onICEConnection = ()=>{}) => {
   
	const userRef = useRef(loggedUserData?.id);
 
  useEffect(() => {
    if (loggedUserData?.id) {
      userRef.current = loggedUserData.id;
    }
  }, [loggedUserData]);
	

  useEffect(() => {
    if (!userRef.current) return;

    const channelName = `live-stream.${userRef.current}`;
		 
    const liveStreamSignal_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('.live-stream.signal', (e) => {
         
				     console.log("  call accept event:", e);
					if ( liveStreamData?.liveId !== e.liveId  ) return;
					
					if (e.type === 'offer') 
					{
						handleOffer(e.payload);
					}
					if (e.type === 'answer') 
					{
						//handleAnswer(e.payload);
					}
					if (e.type === 'ice') 
					{
						//onICEConnection(e.payload);
					}
					
					
        });
    };

    liveStreamSignal_connectWebSocket();
 
    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, loggedUserData, liveStreamData ]);
};

export default useLiveStreamSignalWebsocket;
