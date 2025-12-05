import { memo, useCallback } from 'react';
import {  useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { 
	BsCameraVideo, 
	BsCameraVideoOff
} from 'react-icons/bs';


import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';


const CameraControl= () => {
	
	const dispatch = useDispatch();	
	 
	const toggleCameraList = useCallback(()=>{
		
		dispatch(updateLiveStreamState({
			type:'toggleActionControlList',
			deviceType: 'camera',
			}));
			
	}, []);
	
  return (
		<Button 
			variant="light"
			title="Camera Controls" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
			onClick={toggleCameraList}
		>
			<BsCameraVideo    />
		</Button>
	);
};

export default memo(CameraControl);
