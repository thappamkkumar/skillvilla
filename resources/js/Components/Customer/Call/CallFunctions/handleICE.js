 
const handleICE = async (payload, peerConRef) => {
  try {
    if (Array.isArray(payload)) {
      for (const candidate of payload) {
        await peerConRef.current.addIceCandidate(new RTCIceCandidate(candidate));
      }
    } else {
      await peerConRef.current.addIceCandidate(new RTCIceCandidate(payload));
    }
    console.log('ICE candidates added');
  } catch (err) {
    console.warn('Error adding ICE candidate:', err);
  }
};

export default handleICE;
