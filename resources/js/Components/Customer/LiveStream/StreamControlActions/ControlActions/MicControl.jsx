
import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import { 
	BsMic, 
	BsMicMute, 
} from 'react-icons/bs';

const MicControl= () => {
  return (
		<Button 
			variant="light"
			title="Camera Controls" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
		>
			<BsMic   />
		</Button>
	);
};

export default memo(MicControl);
