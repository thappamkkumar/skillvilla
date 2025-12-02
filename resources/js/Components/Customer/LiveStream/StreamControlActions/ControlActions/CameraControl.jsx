
import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import { 
	BsCameraVideo, 
	BsCameraVideoOff
} from 'react-icons/bs';

const CameraControl= () => {
  return (
		<Button 
			variant="light"
			title="Camera Controls" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
		>
			<BsCameraVideo    />
		</Button>
	);
};

export default memo(CameraControl);
