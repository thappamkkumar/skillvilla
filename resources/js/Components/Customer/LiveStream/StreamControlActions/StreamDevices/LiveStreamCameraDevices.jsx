import { useCallback, useEffect, useMemo, useState, memo } from "react";
import Button from "react-bootstrap/Button";
import { useSelector, useDispatch } from "react-redux";
import { BsCameraVideo, BsCameraVideoOff, BsX } from "react-icons/bs";

import { updateLiveStreamState } from "../../../../../StoreWrapper/Slice/LiveStreamSlice";

const LiveStreamCameraDevices = ({
  peerConRef,
  publisherVideoRef,
  localMediaRef
}) => {
  const liveStreamData = useSelector((state) => state.liveStreamData);
  const logedUserData = JSON.parse(useSelector((state) => state.auth.user));

  const dispatch = useDispatch();

  const [cameraDevices, setCameraDevices] = useState([]);
  const [error, setError] = useState(null);

  const isPublisher = useMemo(() => {
    return logedUserData?.id === liveStreamData?.publisherId;
  }, [logedUserData, liveStreamData.publisherId]);

  // Close list
  const toggleCameraList = useCallback(() => {
    dispatch(
      updateLiveStreamState({
        type: "toggleActionControlList",
        deviceType: "camera"
      })
    );
  }, []);

  // Load camera list
  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setError("Browser does not support enumerateDevices");
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const cams = devices.filter((d) => d.kind === "videoinput");
        setCameraDevices(cams);
      })
      .catch((err) => {
        console.error("Device enumeration failed:", err);
        setError("Could not access camera list");
      });
  }, []);

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

  // Device selection
  const handleSelect = async (deviceId) => {
    try {
      // Turn camera OFF
      if (deviceId === "off") {
        const track = localMediaRef.current?.getVideoTracks()[0];
        if (track) track.enabled = false;

        dispatch(updateLiveStreamState({ type: "setCameraId", cameraId: "off" }));
        toggleCameraList();
        return;
      }

      // Get new camera stream
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId: { exact: deviceId } }
      });

      const newVideoTrack = newStream.getVideoTracks()[0];

      // Replace track in local stream
      const oldStream = localMediaRef.current;
      if (oldStream) {
        oldStream.getVideoTracks().forEach((t) => {
          t.stop();
          oldStream.removeTrack(t);
        });
        oldStream.addTrack(newVideoTrack);
      } else {
        localMediaRef.current = new MediaStream([newVideoTrack]);
      }
			
			
			// Update publisher preview video
			if (isPublisher && publisherVideoRef.current) {
				publisherVideoRef.current.srcObject = localMediaRef.current;
			}
			
			
      // Replace in peers
      const allPeers = getAllPeerConnections();
      allPeers.forEach((pc) => {
        pc.getSenders()
          .filter((s) => s.track && s.track.kind === "video")
          .forEach((sender) => sender.replaceTrack(newVideoTrack));
      });

      // Ensure ON
      newVideoTrack.enabled = true;

      // Update UI selection
      dispatch(
        updateLiveStreamState({
          type: "setCameraId",
          cameraId: deviceId
        })
      );

      toggleCameraList();
    } catch (err) {
      console.error("Camera switch error:", err);
      setError("Could not switch camera");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5>Select Camera</h5>

        <Button variant="outline-light" title="Close" className="p-1" onClick={toggleCameraList} >
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
                variant="dark"
                className={`d-block w-100 border-0 py-2 mb-2 text-start rounded ${
                  liveStreamData.cameraId === device.deviceId && "bg-secondary opacity-75"
                }`}
                onClick={() => handleSelect(device.deviceId)}
                disabled={liveStreamData.cameraId === device.deviceId}
              >
                <BsCameraVideo className="me-2" />
                {device.label || `Camera (${device.deviceId.slice(0, 6)})`}
              </Button>
            ))}

            <Button
              variant="danger"
              className="d-block w-100 border-0 py-2 text-start rounded"
              disabled={liveStreamData.cameraId === "off"}
              onClick={() => handleSelect("off")}
            >
              <BsCameraVideoOff className="me-2" />
              Turn Off Camera
            </Button>
          </div>
        ) : (
          <div>No camera devices found</div>
        )}
      </div>
    </div>
  );
};

export default memo(LiveStreamCameraDevices);
