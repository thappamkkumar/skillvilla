import { memo, useCallback } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { 
	BsCameraVideo, 
	BsCameraVideoOff
} from 'react-icons/bs';


import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';


const CameraControl= () => {
	const liveStreamData = useSelector((state) => state.liveStreamData);
 
	const dispatch = useDispatch();	
	 
	const toggleCameraList = useCallback(()=>{
		
		dispatch(updateLiveStreamState({
			type:'toggleActionControlList',
			deviceType: 'camera',
			}));
			
	}, []);
	
  return (
		<Button 
			variant={liveStreamData.cameraId == 'off' ? "secondary" : "light"}
			title="Cameras" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
			onClick={toggleCameraList}
		>
			{
				liveStreamData.cameraId == 'off' ? <BsCameraVideoOff /> : <BsCameraVideo />
			}
		</Button>
	);
};

export default memo(CameraControl);
