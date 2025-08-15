import { useEffect, useState } from "react";
import { BsCameraVideo, BsX } from "react-icons/bs";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from 'react-redux';

import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';


const CameraDevices = ({ show, onClose, peerConRef, localVideoRef }) => {
	
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

  const handleSelect = async (deviceId) => {
		try 
		{
			if (peerConRef?.current) {
				const senders = peerConRef.current.getSenders();
				const videoSender = senders.find(s => s.track && s.track.kind === 'video');

				if (deviceId === 'off') {
					// Just disable the video track (mute camera)
					if (videoSender?.track) {
						videoSender.track.enabled = false;
					}
					
					// Show black screen in preview
					if (localVideoRef?.current) {
						localVideoRef.current.srcObject = null;
					}
					
				}
				else 
				{
					// Get new camera stream
					const newStream = await navigator.mediaDevices.getUserMedia({
						video: { deviceId: { exact: deviceId } }
					});
					const newVideoTrack = newStream.getVideoTracks()[0];

					if (videoSender) {
						await videoSender.replaceTrack(newVideoTrack);
					}

					// Enable the track in case it was muted before
					if (videoSender?.track) {
						videoSender.track.enabled = true;
					}
					
					// Update local preview
					if (localVideoRef?.current) {
						localVideoRef.current.srcObject = newStream;
					}
					
				}
			}


			// Update Redux
			dispatch(updateChatCallState({
				type: 'setCamera',
				cameraId: deviceId
			}));

			onClose();
			
		} 
		catch (err) 
		{
			console.error("Error switching camera:", err);
		}
	};


  if (!show) return null;

  return (
    <div  className="fixed-top w-100 h-100 bg-dark bg-opacity-50 d-flex justify-content-center align-items-center z-3 p-3"  	>
      <div 
				className="bg-white rounded shadow-lg device-list-card " 
			>
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
