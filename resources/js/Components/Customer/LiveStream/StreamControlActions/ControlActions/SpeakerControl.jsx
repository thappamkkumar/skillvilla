
import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import { 
	BsVolumeUp ,
	BsVolumeMute,
} from 'react-icons/bs';

const SpeakerControl= () => {
  return (
		<Button 
			variant="light"
			title="Camera Controls" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
		>
			<BsVolumeUp    />
		</Button>
	);
};

export default memo(SpeakerControl);
