import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {updateLiveStreamState} from '../../StoreWrapper/Slice/LiveStreamSlice';

const useLiveStreamMessageWebsocket = (loggedUserData,  ) => {

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
		 
    const liveStreamMessage_connectWebSocket = () => {
      window.Echo.private(channelName)
        .listen('.live-stream.message', (e) => {
          // console.log("message:", e);
					const message = e.message;
					const messageData = {
									messageId: message.id ,
									liveId: message.live_stream_id ,
									newMessage: message.message ,
									senderId: message.sender_id ,
									sender: message?.sender || {} ,
								};
					
					if(loggedUserData.id != messageData.senderId )
					{
						dispatch(updateLiveStreamState({type : 'newMessage', data: messageData})); 
					}
					
					
					
        });
    };

    liveStreamMessage_connectWebSocket();

    return () => {
      window.Echo.leave(channelName);
    };
  }, [userRef.current, dispatch, loggedUserData ]);
};

export default useLiveStreamMessageWebsocket;
