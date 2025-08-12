 
const handleAnswer = async (payload,   peerConRef   ) => {
	
    
	try 
	{
		await peerConRef.current.setRemoteDescription(new RTCSessionDescription(payload));
	 
  } catch (err) {
		console.warn("Error adding ICE candidate:");
	}
};

export default handleAnswer;
