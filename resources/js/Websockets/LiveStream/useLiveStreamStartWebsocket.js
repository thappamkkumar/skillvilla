import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {updateActiveLiveState} from '../../StoreWrapper/Slice/ActiveLiveSlice';

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
          //console.log("Live Stream Start Data:", e.liveStream);
					
					const liveStreamData = e.liveStream;
					dispatch(updateActiveLiveState({type : 'addNewQuickLive', newQuickLive: liveStreamData}));  
        });
    };

    liveStreamStart_connectWebSocket();

    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useLiveStreamStartWebsocket;
