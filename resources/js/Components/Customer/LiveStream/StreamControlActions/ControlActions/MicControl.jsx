
import { memo, useCallback } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { 
	BsMic, 
	BsMicMute, 
} from 'react-icons/bs';

import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';


const MicControl= () => {
	const liveStreamData = useSelector((state) => state.liveStreamData);
 
	const dispatch = useDispatch();	
	 
	const toggleMicList = useCallback(()=>{
		
		dispatch(updateLiveStreamState({
			type:'toggleActionControlList',
			deviceType: 'mic',
			}));
			
	}, []);
	
  return (
		<Button 
			variant={liveStreamData.micId == 'off' ? "secondary" : "light"}
			title="Mics" 
			id="micControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
			onClick={toggleMicList}
		>
			{
				liveStreamData.micId == 'off' ? <BsMicMute /> : <BsMic />
			}
		</Button>
	);
};

export default memo(MicControl);
