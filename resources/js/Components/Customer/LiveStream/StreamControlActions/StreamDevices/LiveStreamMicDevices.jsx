

import   { useCallback, useMemo,  memo } from 'react';
import Button from 'react-bootstrap/Button';
import { useSelector, useDispatch } from 'react-redux'; 

import { useEffect, useState } from "react";
import { BsMic,BsMicMute, BsX } from "react-icons/bs";  


import {updateLiveStreamState} from '../../../../../StoreWrapper/Slice/LiveStreamSlice';

const LiveStreamMicDevices = ({ 
	peerConRef, 
	localMediaRef
})=>{

	const liveStreamData = useSelector((state) => state.liveStreamData);
 
	const [micDevices, setMicDevices] = useState([]);
  const [error, setError] = useState(null);
	
	
	const dispatch = useDispatch();	
	
	
	 
	
	
	//close list
	const toggleMicList = useCallback(()=>{
		
		dispatch(updateLiveStreamState({
			type:'toggleActionControlList',
			deviceType: 'mic',
			}));
			
	}, []);
	
	
	
	useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      setError("Your browser does not support mediaDevices API");
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const mics = devices.filter((d) => d.kind === "audioinput");
        setMicDevices(mics);
      })
      .catch((err) => {
        console.warn("Error accessing devices:", err);
        setError("Could not access mic list");
      });
  }, [ ]);


	const getAllPeerConnections = useCallback(() => {
		const peers = peerConRef.current;

		if (!peers) return [];

		// Viewer side → single RTCPeerConnection
		if (peers instanceof RTCPeerConnection) {
			return [peers];
		}

		// Publisher side → object of RTCPeerConnections
		if (typeof peers === "object") {
			return Object.values(peers).filter(pc => pc instanceof RTCPeerConnection);
		}

		return [];
	}, []);


	const handleSelect = async (deviceId) => {
		try 
		{
			
			if (deviceId === "off") {
				const track = localMediaRef.current
					?.getAudioTracks()[0];

				if (track) track.enabled = false;

				dispatch(updateLiveStreamState({
					type: "setMicId",
					micId: "off"
				}));

				toggleMicList();
				return;
			}
			
			// Get new audio stream from selected microphone
			const newStream = await navigator.mediaDevices.getUserMedia({
				audio: { deviceId: { exact: deviceId } }
			});

			const newAudioTrack = newStream.getAudioTracks()[0];
		
		
			// Update the localMediaRef stream
			const oldStream = localMediaRef.current;

			if (oldStream) {
				oldStream.getAudioTracks().forEach( t => {
					t.stop();
					oldStream.removeTrack(t);					
				});
				oldStream.addTrack(newAudioTrack);
			} else {
				localMediaRef.current = new MediaStream([newAudioTrack]);
			}
			
			
			// Replace in ALL peers (publisher or viewer(member) )
			const allPeers = getAllPeerConnections();
			allPeers.forEach(pc => {
				pc.getSenders()
					.filter(s => s.track && s.track.kind === "audio")
					.forEach(sender => sender.replaceTrack(newAudioTrack));
			});
			
			
			 
			

			// Ensure mic is enabled
			newAudioTrack.enabled = true;

			// Update UI state
			dispatch(updateLiveStreamState({
				type: "setMicId",
				micId: deviceId
			}));
		
		 toggleMicList();
 
			 
		}
		catch (err) {
			console.error('Error switching microphone:', err);
			setError('Could not switch microphone');
		}		
		 
	};
	
	
	return(
		 <div 
				className=" " 
			>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5>Select Microphone</h5>
          <Button
            variant="outline-light"
            className="p-1   "
            onClick={toggleMicList}
            title="Close"
          >
            <BsX className="fw-bold fs-3" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-2 d-flex flex-column align-items-stretch">
          {error ? (
            <div className="text-danger">{error}</div>
          ) : micDevices.length > 0 ? (
            <div>
              {micDevices.map((device) => (
                <Button
                  key={device.deviceId}
									id={device.deviceId}
                  title="Mic"
                  variant="dark"
                  className={`d-block w-100 border-0 py-2 mb-2 text-start rounded  
									${liveStreamData.micId == device.deviceId && 'bg-secondary' } `}  
                  onClick={() => handleSelect(device.deviceId)}
									disabled={liveStreamData.micId == device.deviceId}
                >
                  <BsMic className="me-2" />
                  {device.label || `Mic (${device.deviceId.slice(0, 6)})`}
                </Button>
              ))}
							 
							<Button
                   
                  id="muteMic"
                  title="Mute Mic"
                  variant="danger"
                  className=" d-block w-100 border-0 py-2    text-start rounded   " 
									disabled={liveStreamData.micId == 'off'}
                  onClick={() => handleSelect('off')}
              >
                  <BsMicMute className="me-2"/>
                   Mute
              </Button>
            </div>
          ) : (
            <div>No camera devices found</div>
          )}
        </div>
      </div>
	);
}

export default memo(LiveStreamMicDevices);