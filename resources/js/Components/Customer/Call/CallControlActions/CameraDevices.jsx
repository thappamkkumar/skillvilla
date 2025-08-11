import { useEffect, useState } from "react";
import { BsCameraVideo, BsX } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from 'react-redux';

import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';


const CameraDevices = ({ show, onClose }) => {
	
	const chatCallData = useSelector((state) => state.chatCallData);
 
  const [cameraDevices, setCameraDevices] = useState([]);
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
        const cameras = devices.filter((d) => d.kind === "videoinput");
        setCameraDevices(cameras);
      })
      .catch((err) => {
        console.warn("Error accessing devices:", err);
        setError("Could not enumerate devices");
      });
  }, []);

  const handleSelect = (deviceId) => {
		dispatch(updateChatCallState(
		{
			'type' : 'setCamera', 
			'cameraId':deviceId, 
		}
		)); 
    onClose();
  };

  if (!show) return null;

  return (
    <div className="fixed-top w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3">
      <div className="bg-white rounded shadow-lg">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
          <h5>Select Camera</h5>
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
          ) : cameraDevices.length > 0 ? (
            <div>
              {cameraDevices.map((device) => (
                <Button
                  key={device.deviceId}
									id={device.deviceId}
                  title="Camera"
                  variant="light"
                  className={`d-block w-100 border-0 py-2 mb-2 text-start rounded navigation_link
									${chatCallData.cameraId == device.deviceId && 'bg-secondary' } `}  
                  onClick={() => handleSelect(device.deviceId)}
									disabled={chatCallData.cameraId == device.deviceId}
                >
                  <BsCameraVideo className="me-2" />
                  {device.label || `Camera (${device.deviceId.slice(0, 6)})`}
                </Button>
              ))}
							 
							<Button
                   
                  id="offCamera"
                  title="Off Camera"
                  variant="danger"
                  className=" d-block w-100 border-0 py-2    text-start rounded  exploreFilterClearBTN" 
									disabled={chatCallData.cameraId == 'off'}
                  onClick={() => handleSelect('off')}
              >
                  <BsCameraVideo className="me-2"/>
                   Mute
              </Button>
            </div>
          ) : (
            <div>No camera devices found</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraDevices;
