import { useSelector } from 'react-redux';
import useLiveStreamStartWebsocket from '../../../Websockets/LiveStream/useLiveStreamStartWebsocket';

const LiveStreamManager = () => {
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
  // Call the websocket hook
  useLiveStreamStartWebsocket(logedUserData);
 
 // return null if no live stream start
	if(liveStreamData.liveStatus === 'idle') return null;
	
  return(
		<>
		 live stream
			
		</>
	);
};

export default LiveStreamManager;
