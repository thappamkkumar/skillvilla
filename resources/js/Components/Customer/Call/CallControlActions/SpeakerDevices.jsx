import { useEffect, useState } from "react";
import { BsVolumeUp, BsVolumeMute,  BsX } from "react-icons/bs";
import Button from "react-bootstrap/Button"; // You can replace with your own button if needed
import { useSelector, useDispatch } from 'react-redux';

import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';


const SpeakerDevices = ({ show, onClose }) => {
	
	const chatCallData = useSelector((state) => state.chatCallData);
 
  const [speakerDevices, setSpeakerDevices] = useState([]);
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
        const speakers = devices.filter((d) => d.kind === "audiooutput");
        
        setSpeakerDevices(speakers);
      })
      .catch((err) => {
        console.warn("Error accessing devices:", err);
        setError("Could not enumerate devices");
      });
  }, [show]);

  const handleSelect = (deviceId) => {
		dispatch(updateChatCallState(
		{
			'type' : 'setSpeaker', 
			'speakerId':deviceId, 
		}
		)); 
		 
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed-top   w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3 p-3">
      <div className=" bg-white rounded shadow-lg device-list-card ">
        {/* Header */}
        <div className=" d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5>Select Speaker</h5>
          <Button
            variant="outline-dark"
            className="p-1 border-2 border-dark"
            onClick={onClose}
            id="speakerListCloseButton"
            title="Close"
          >
            <BsX className="fw-bold fs-3" />
          </Button>
        </div>

        {/* Body */}
        <div className="p-2 d-flex flex-column align-items-stretch">
          {error ? (
            <div className="text-danger">{error}</div>
          ) : speakerDevices.length > 0 ? (
            <div className=" ">
              {speakerDevices.map((device) => (
                <Button
                  key={device.deviceId}
                  id={device.deviceId}
                  title="Speaker"
                  variant="light"
                  className={` d-block w-100 border-0 py-2 mb-2   text-start rounded navigation_link 
									${chatCallData.speakerId == device.deviceId && 'bg-secondary'} 
									
									`}
                  onClick={() => handleSelect(device.deviceId)}
									disabled={chatCallData.speakerId == device.deviceId}
                >
                  <BsVolumeUp className="me-2"/>
                  {device.label || `Speaker (${device.deviceId.slice(0, 6)})`}
                </Button>
              ))}
							
							 
							
							<Button
                   
                  id="offSpeaker"
                  title="Off Speaker"
                  variant="danger"
                  className=" d-block w-100 border-0 py-2    text-start rounded  exploreFilterClearBTN"
									 									
									disabled={chatCallData.speakerId == 'off'}
                  onClick={() => handleSelect('off')}
              >
                  <BsVolumeMute className="me-2"/>
                   Off
              </Button>
            </div>
          ) : (
            <div>No speaker devices found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpeakerDevices;
