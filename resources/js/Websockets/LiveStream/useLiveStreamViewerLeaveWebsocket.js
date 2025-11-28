import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {updateLiveStreamState} from '../../StoreWrapper/Slice/LiveStreamSlice';

const useLiveStreamViewerLeaveWebsocket = (loggedUserData, liveStreamData) => {
	
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
		 
    const liveStreamViewerLeave_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('.live-stream.viewer-leave', (e) => {
          
					//console.log("Live Stream   Data:", e);
					if(liveStreamData?.liveId !== e.live_stream_id )
					{ 
						return;
					}
					
					if(loggedUserData?.id == e.viewer_user_id)
					{
						dispatch(updateLiveStreamState({type : 'refresh'})); 
						return;
					}
					const liveData = {
						liveId:  e.live_stream_id,
						viewerUserId:  e.viewer_user_id,
					};
					dispatch(updateLiveStreamState({type : 'removeViewer', liveData: liveData}));   
					
        });
    };

		liveStreamViewerLeave_connectWebSocket();

    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current,   loggedUserData,   ]);
};

export default useLiveStreamViewerLeaveWebsocket;
