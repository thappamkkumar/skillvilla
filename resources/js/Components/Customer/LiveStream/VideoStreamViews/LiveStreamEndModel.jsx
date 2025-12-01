

import   { useCallback,   memo } from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux'; 

import {updateLiveStreamState} from '../../../../StoreWrapper/Slice/LiveStreamSlice';

const LiveStreamEndModel = ({ 
	peerConRef,
	publisherVideoRef,
	localMediaRef
})=>{

	const liveStreamData = useSelector((state) => state.liveStreamData);
	const dispatch = useDispatch();	
	
	const handleLeaveLiveStream = useCallback(()=>{
		
		if (localMediaRef.current) { 
				localMediaRef.current.getTracks().forEach(track => track.stop());
				localMediaRef.current = null;
		}

		if(publisherVideoRef.current)
		{
			publisherVideoRef.current = null;
		}
					
		if(peerConRef.current)
		{
			publisherVideoRef.current = null;
		}
					
					
		 dispatch(updateLiveStreamState(
					{ 
						'type':'refresh',   
					}
				));
	},[]);
	
	if(!liveStreamData.isEnd) return;
	
	return(
		<div className="position-fixed top-0 z-3 bg-dark  w-100 h-100 d-flex justify-content-center align-items-center">
			<div className=" d-flex flex-column justify-content-center align-items-center text-white-50 gap-4" 
			>
				<h1><strong> Live Ended </strong></h1>
				<Button
					variant = "danger"
					title="Leave Live Stream"
					id="leaveLiveStream"
					className=" fw-bold "
					onClick={handleLeaveLiveStream}
				>
					Leave
				</Button>
			</div>
		</div>
	);
}

export default memo(LiveStreamEndModel);