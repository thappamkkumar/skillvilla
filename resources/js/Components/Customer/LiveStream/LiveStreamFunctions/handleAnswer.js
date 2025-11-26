const handleAnswer = async (payload, viewerId, peerConRef) => {
    try {
        
				if(viewerId == null){
					console.log("Viewer is not found.");
					return;
				}

        const pc = peerConRef.current[viewerId];  // pick correct peer

        if (!pc) {
            console.warn("Peer not found for viewer:", viewerId);
            return;
        }

        await pc.setRemoteDescription(new RTCSessionDescription(payload));

    } catch (err) {
        console.warn("Error setting remote description:", err);
    }
};


export default handleAnswer;

