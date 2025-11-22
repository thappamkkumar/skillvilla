import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {updateLiveStreamState} from '../../StoreWrapper/Slice/LiveStreamSlice';

const useLiveStreamNewViewerWebsocket = (loggedUserData) => {
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
		 
    const liveStreamNewViewer_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('.live-stream.new-viewer', (e) => {
          
					//console.log("Live Stream   Data:", e.new_viewer);
					
					const liveStreamData = {
						liveId:  e.live_stream_id,
						newViewer:  e.new_viewer,
					};
					dispatch(updateLiveStreamState({type : 'addNewViewer', newViewerData: liveStreamData}));  
					
        });
    };

    liveStreamNewViewer_connectWebSocket();

    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useLiveStreamNewViewerWebsocket;
