
import { memo, useCallback } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { 
	BsVolumeUp ,
	BsVolumeMute,
} from 'react-icons/bs';

import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';

const SpeakerControl= () => {
	
	const liveStreamData = useSelector((state) => state.liveStreamData);
 
	const dispatch = useDispatch();	
	 
	const toggleSpeakerList = useCallback(()=>{
		
		dispatch(updateLiveStreamState({
			type:'toggleActionControlList',
			deviceType: 'speaker',
			}));
			
	}, []);
	
	
  return (
		<Button 
			variant={liveStreamData.speakerId == 'off' ? "secondary" : "light"}
			title="Speakers" 
			id="speakerControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
			onClick={toggleSpeakerList}
		>
			{
				liveStreamData.speakerId == 'off' ? <BsVolumeMute /> : <BsVolumeUp />
			}
		</Button>
	);
};

export default memo(SpeakerControl);
