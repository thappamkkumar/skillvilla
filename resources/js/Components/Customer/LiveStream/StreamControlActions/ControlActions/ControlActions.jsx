
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';

// control components
import MicButton from './MicControl';
import CameraButton from './CameraControl';
import SpeakerButton from './SpeakerControl';
import HoldButton from './HoldControl';
import ReactionButton from './ReactionControl';


const ControlActions = () =>{
	const liveStreamData = useSelector((state) => state.liveStreamData);
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));

	const isPublisher = useMemo(()=>{ return logedUserData?.id === liveStreamData?.publisherId },[logedUserData, liveStreamData.publisherId]);
  
	const isCurrentViewer = useMemo(()=>{ return logedUserData?.id === liveStreamData?.currentViewer?.viewer_id  },[logedUserData, liveStreamData.currentViewer]);
  
	const isSharing = useMemo(()=>{ return liveStreamData?.currentViewer?.is_sharing  },[liveStreamData.currentViewer]);

	
	const buttons = [];
	
	
  if (isPublisher) {
    buttons.push('mic', 'camera', 'speaker', 'hold');
  }

  if (isCurrentViewer) {
    if (isSharing) {
      buttons.push('reaction', 'mic', 'camera', 'speaker', 'hold');
    } else {
      buttons.push('reaction', 'speaker');
    }
  }


  // Remove duplicates
  const uniqueButtons = [...new Set(buttons)];


	const renderButton = (code) => {
    switch (code) {
      case 'mic': return <MicButton key="mic" />;
      case 'camera': return <CameraButton key="camera" />;
      case 'speaker': return <SpeakerButton key="speaker" />;
      case 'hold': return <HoldButton key="hold" />;
      case 'reaction': return <ReactionButton key="reaction" />;
      default: return null;
    }
  };

  return <>{uniqueButtons.map(renderButton)}</>;
	 
}

export default memo(ControlActions);