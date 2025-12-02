
import { memo } from 'react';
import Button from 'react-bootstrap/Button';
import { BsPause, BsPauseFill } from 'react-icons/bs';

const HoldControl= () => {
 return (
		<Button 
			variant="light"
			title="Camera Controls" 
			id="cameraControlBTN" 
			className={`rounded-circle    fs-5 p-3  lh-1       `}
		>
			<BsPause    />
		</Button>
	);
};

export default memo(HoldControl);
