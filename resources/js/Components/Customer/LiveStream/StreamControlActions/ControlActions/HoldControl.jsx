import { memo, useCallback } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import { BsPause, BsPauseFill } from 'react-icons/bs';


import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';


const HoldControl = ({ localMediaRef, peerConRef }) => {
	
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	const dispatch = useDispatch();	
	 
	// Peer connections (publisher or viewer)
  const getAllPeerConnections = useCallback(() => {
    const peers = peerConRef.current;

    if (!peers) return [];

    if (peers instanceof RTCPeerConnection) return [peers];

    if (typeof peers === "object") {
      return Object.values(peers).filter(
        (pc) => pc instanceof RTCPeerConnection
      );
    }

    return [];
  }, []);
	
	
	const handleHold = useCallback(()=>{
		try
		{ 
			const videoTracks = localMediaRef.current?.getVideoTracks() || [];
			const audioTracks = localMediaRef.current?.getAudioTracks() || [];

			const newHoldState = !liveStreamData.isHold;

			// Disable/enable outgoing tracks
			videoTracks.forEach(t => (t.enabled = !newHoldState));
			audioTracks.forEach(t => (t.enabled = !newHoldState));
			
			// Replace in peers
			const allPeers = getAllPeerConnections();
			allPeers.forEach((pc) => {
				pc.getSenders().forEach((sender) => {
					if (!sender.track) return;
					sender.track.enabled = !newHoldState;
				});
			});
		
			dispatch(updateLiveStreamState({
				type: "setHold",
				isHold: newHoldState
			}));
		}
		catch(e)
		{
			console.log(e);
		}
	}, [liveStreamData]);




 return (
		<Button 
			variant={liveStreamData.isHold ? "secondary" : "light"}
			id="holdControlBTN"
      title={liveStreamData.isHold ? "Resume Stream" : "Hold Stream"}
			className={`rounded-circle    fs-5 p-3  lh-1       `}
			onClick={handleHold}
		>
			{liveStreamData.isHold ? <BsPauseFill /> :	<BsPause    /> }
		</Button>
	);
};

export default memo(HoldControl);
