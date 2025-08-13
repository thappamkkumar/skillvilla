import { useEffect, useState } from "react";
import { BsMic, BsX } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from 'react-redux';

import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';


const MicDevices = ({ show, onClose, peerConRef }) => {
	
	const chatCallData = useSelector((state) => state.chatCallData);
 
  const [micDevices, setMicDevices] = useState([]);
  const [error, setError] = useState(null);
	
	const dispatch = useDispatch();
	
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
        setError("Could not enumerate devices");
      });
  }, [show]);

  const handleSelect = async(deviceId) => {
		
		
		//change mic for input
		try
		{
			if (deviceId !== 'off') 
			{
				// Get the new microphone stream
				const newStream = await navigator.mediaDevices.getUserMedia({
					audio: { deviceId: { exact: deviceId } }
				});

				const newTrack = newStream.getAudioTracks()[0];

				// Replace track in the PeerConnection
				const sender = peerConRef.current
					?.getSenders()
					.find(s => s.track && s.track.kind === 'audio');
					
				if (sender) 
				{
					sender.replaceTrack(newTrack);
				}
			} 
			else 
			{
				// Mute by disabling the current track
				const sender = peerConRef.current
					?.getSenders()
					.find(s => s.track && s.track.kind === 'audio');
				if (sender?.track) 
				{
					sender.track.enabled = false;
				}
			}
			
			dispatch(updateChatCallState(
				{
					'type' : 'setMic', 
					'micId':deviceId, 
				}
			)); 
			onClose();
		} 
		catch (err) 
		{
			console.error('Error switching microphone:', err);
		}
		
		
		
   
  };

  if (!show) return null;

  return (
    <div className="fixed-top w-100 h-100 bg-dark bg-opacity-50  d-flex justify-content-center align-items-center z-3">
      <div className="bg-white rounded shadow-lg  ">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5>Select Microphone</h5>
          <Button
            variant="outline-dark"
            className="p-1 border-2 border-dark"
            onClick={onClose}
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
                  variant="light"
                  className={` d-block w-100 border-0 py-2 mb-2 text-start rounded navigation_link
									${chatCallData.micId == device.deviceId && 'bg-secondary'} 
									`}
                  onClick={() => handleSelect(device.deviceId)}
									disabled={chatCallData.micId == device.deviceId}
                >
                  <BsMic className="me-2" />
                  {device.label || `Mic (${device.deviceId.slice(0, 6)})`}
                </Button>
              ))}
							
							 
							
							<Button
                   
                  id="muteMic"
                  title="Mute Mic"
                  variant="danger"
                  className=" d-block w-100  border-0 py-2    text-start rounded  exploreFilterClearBTN" 
									disabled={chatCallData.micId == 'off'}
                  onClick={() => handleSelect('off')}
              >
                  <BsMic className="me-2"/>
                   Mute
              </Button>
							
							
            </div>
          ) : (
            <div>No microphone devices found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MicDevices;
