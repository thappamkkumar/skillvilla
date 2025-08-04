import { useEffect, useState } from "react";
import { BsVolumeUp } from "react-icons/bs";
import { Modal, Button } from "react-bootstrap";

const SpeakerDevices = ({ show, onClose  }) => {
  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [error, setError] = useState(null);

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
  }, []);

  const handleSelect = (deviceId) => {
     
    onClose(); // Close modal after selection
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header  closeButton
				 
			>
        <Modal.Title>Select Speaker</Modal.Title>
      </Modal.Header>
      <Modal.Body className="p-0">
        {error ? (
          <div className="text-danger">{error}</div>
        ) : speakerDevices.length > 0 ? (
          <div className="list-group">
            {speakerDevices.map((device) => (
              <button
                key={device.deviceId}
                className="list-group-item list-group-item-action d-flex align-items-center border-0"
                onClick={() => handleSelect(device.deviceId)}
              >
                <BsVolumeUp className="me-2" />
                {device.label || `Speaker (${device.deviceId.slice(0, 6)})`}
              </button>
            ))}
          </div>
        ) : (
          <div>No speaker devices found</div>
        )}
      </Modal.Body>
       
    </Modal>
  );
};

export default SpeakerDevices;
