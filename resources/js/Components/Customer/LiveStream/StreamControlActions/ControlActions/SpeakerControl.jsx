
import { memo, useCallback } from 'react';
import {  useDispatch } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { 
	BsVolumeUp ,
	BsVolumeMute,
} from 'react-icons/bs';

import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';

const SpeakerControl= () => {
	
	
	const dispatch = useDispatch();	
	 
	const toggleSpeakerList = useCallback(()=>{
		
		dispatch(updateLiveStreamState({
			type:'toggleActionControlList',
			deviceType: 'speaker',
			}));
			
	}, []);
	
	
  return (
		<Button 
			variant="light"
			title="Camera Controls" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
			onClick={toggleSpeakerList}
		>
			<BsVolumeUp    />
		</Button>
	);
};

export default memo(SpeakerControl);
