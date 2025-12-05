

import   {memo } from 'react'; 
import { useSelector } from 'react-redux'; 

import LiveStreamMicDevices from './LiveStreamMicDevices';

const LiveStreamDevices = ({ 
	peerConRef,
	publisherVideoRef,
	localMediaRef
})=>{

	const liveStreamData = useSelector((state) => state.liveStreamData);
	 
	 
	if(!liveStreamData.micListShow && !liveStreamData.speakerListShow && !liveStreamData.cameraListShow && !liveStreamData.reactionListShow) return;
	
	return(
		<div className="position-fixed top-0 z-3  w-100 h-100 d-flex justify-content-center align-items-center bg-dark  bg-opacity-25  "   >
			<div className="bg-dark  text-light rounded shadow-lg device-list-card" 
			>
				 
				{
					liveStreamData.micListShow &&
					<LiveStreamMicDevices 
						peerConRef={peerConRef} 
						localMediaRef={localMediaRef}
					/>
				}
			 
			
			</div>
		</div>
	);
}

export default memo(LiveStreamDevices);