import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { updateLiveStreamState } from '../../StoreWrapper/Slice/LiveStreamSlice';

const useLiveStreamStartWebsocket = (loggedUserData) => {
  const userRef = useRef(loggedUserData?.id);
  const dispatch = useDispatch();

  useEffect(() => {
    if (loggedUserData?.id) {
      userRef.current = loggedUserData.id;
    }
  }, [loggedUserData]);



  useEffect(() => {
    if (!userRef.current) return;

    const channelName = `live-stream.${userRef.current}`;
		 
    const liveStreamStart_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('.live-stream.started', (e) => {
          //console.log("Live Stream Start Data:", e.data);
					
					const liveStreamData = e.data
				/*	dispatch(updateLiveStreamState(
					{ 
						'type':'liveStreamStart',  
						'data': liveStreamData
						}
					));
					*/
					console.log('add live stream active live list state. dont start live directly');
        });
    };

    liveStreamStart_connectWebSocket();

    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useLiveStreamStartWebsocket;
