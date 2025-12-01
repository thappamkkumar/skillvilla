import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {updateLiveStreamState} from '../../StoreWrapper/Slice/LiveStreamSlice';
import {updateActiveLiveState} from '../../StoreWrapper/Slice/ActiveLiveSlice';

const useLiveStreamEndWebsocket = (loggedUserData) => {

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
		 
    const liveStreamEnd_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('.live-stream.ended', (e) => {
					// console.log("Live Stream End Data:", e);
					
					dispatch(updateActiveLiveState({type : 'removeQuickLive', liveId: e.live_id}));  
					dispatch(updateLiveStreamState({type : 'liveStreamEnd', liveId: e.live_id}));  
					
        });
    };

    liveStreamEnd_connectWebSocket();

    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useLiveStreamEndWebsocket;
