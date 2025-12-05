import { useEffect, useState, useCallback, memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import { BsVolumeUp, BsVolumeMute, BsX } from "react-icons/bs";

import { updateLiveStreamState } from "../../../../../StoreWrapper/Slice/LiveStreamSlice";

const LiveStreamSpeakerDevices = ({publisherVideoRef}) => {
  const dispatch = useDispatch();

  const liveStreamData = useSelector((state) => state.liveStreamData);
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));

  const [speakerDevices, setSpeakerDevices] = useState([]);
  const [error, setError] = useState(null);
	
	
	const isPublisher = useMemo(() => {
    return logedUserData?.id === liveStreamData?.publisherId;
  }, [logedUserData, liveStreamData.publisherId]);

	
  // Close device list
  const toggleSpeakerList = useCallback(() => {
    dispatch(
      updateLiveStreamState({
        type: "toggleActionControlList",
        deviceType: "speaker"
      })
    );
  }, []);

  // Load audiooutput devices
  useEffect(() => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      setError("Browser does not support enumerateDevices");
      return;
    }

    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        const outputs = devices.filter((d) => d.kind === "audiooutput");
        setSpeakerDevices(outputs);
      })
      .catch((err) => {
        console.error("Speaker enumeration failed:", err);
        setError("Could not access speaker list");
      });
  }, []);

//Device selection
  const handleSelect = async(deviceId) => {
		dispatch(
				updateLiveStreamState({
					type: "setSpeakerId",
					speakerId: deviceId
				})
			);
		// Publisher does not route audio
		if (isPublisher) {
			console.log('for speaker change for member must has first ref (i.e. object of member peer connection object). change speaker for all');
			
			
			toggleSpeakerList();
			return;
		}
		
		const videoEl = publisherVideoRef?.current;
		if (!videoEl) {
			toggleSpeakerList();
			return;
		}
		
		try {
			// Turn OFF speaker
			if (deviceId === "off") {
				videoEl.muted = true;
				toggleSpeakerList();
				return;
			}
			
			    // Restore audio
			videoEl.muted = false;
			//videoEl.volume = 1;

			if (videoEl.setSinkId) {
				await videoEl.setSinkId(deviceId);

				// VERY IMPORTANT
				await videoEl.play().catch(() => {});
			} else {
				console.warn("setSinkId not supported");
			}
			
			 
			toggleSpeakerList()
		}
		catch (e) {
			console.error("Speaker change error:", e);
		}	 
		
    ;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 border-bottom">
        <h5>Select Speaker</h5>

        <Button
          variant="outline-light"
					id="closeBTN"
          title="Close"
          className="p-1"
          onClick={toggleSpeakerList}
        >
          <BsX className="fw-bold fs-3" />
        </Button>
      </div>

      {/* Body */}
      <div className="p-2 d-flex flex-column align-items-stretch">
        {error ? (
          <div className="text-danger">{error}</div>
        ) : speakerDevices.length > 0 ? (
          <div> 

            {/* List devices */}
            {speakerDevices.map((device) => (
              <Button
                key={device.deviceId}
                variant="dark"
                className={`d-block w-100 border-0 py-2 mb-2 text-start rounded ${
                  liveStreamData.speakerId === device.deviceId &&
                  "bg-secondary opacity-75"
                }`}
                onClick={() => handleSelect(device.deviceId)}
                disabled={liveStreamData.speakerId === device.deviceId}
              >
                <BsVolumeUp className="me-2" />
                {device.label || `Speaker (${device.deviceId.slice(0, 6)})`}
              </Button>
            ))}

            {/* Turn off */}
            <Button
              variant="danger"
              title="Off Speaker"
              className="d-block w-100 border-0 py-2 text-start rounded"
              onClick={() => handleSelect("off")}
              disabled={liveStreamData.speakerId === "off"}
            >
              <BsVolumeMute className="me-2" />
              Off
            </Button>
          </div>
        ) : (
          <div>No speaker devices found</div>
        )}
      </div>
    </div>
  );
};

export default memo(LiveStreamSpeakerDevices);
