 import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';
 
 
 const handleICE = async (payload, peerConRef  ) => {
  try {
    if (Array.isArray(payload)) {
      for (const candidate of payload) {
        try {
          await peerConRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        } catch (err) {
          console.warn("Non-fatal ICE candidate error:", err);
        }
      }
    } else {
      try {
        await peerConRef.current.addIceCandidate(new RTCIceCandidate(payload));
      } catch (err) {
        console.warn("Non-fatal ICE candidate error:", err);
      }
    }

    
    //console.log('ICE candidates processed');
  } catch (err) {
    console.error("Critical ICE handling error:", err);
    
  }
	 
};

export default handleICE;
