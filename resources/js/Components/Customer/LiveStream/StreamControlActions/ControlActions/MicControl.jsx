
import { memo, useCallback } from 'react';
import {  useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { 
	BsMic, 
	BsMicMute, 
} from 'react-icons/bs';

import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';


const MicControl= () => {
	
	const dispatch = useDispatch();	
	 
	const toggleMicList = useCallback(()=>{
		
		dispatch(updateLiveStreamState({
			type:'toggleActionControlList',
			deviceType: 'mic',
			}));
			
	}, []);
	
  return (
		<Button 
			variant="light"
			title="Camera Controls" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
			onClick={toggleMicList}
		>
			<BsMic   />
		</Button>
	);
};

export default memo(MicControl);
