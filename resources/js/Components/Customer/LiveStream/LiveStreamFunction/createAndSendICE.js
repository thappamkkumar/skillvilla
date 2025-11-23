import serverConnection from '../../../../CustomHook/serverConnection';
 

ateAndSendICE = async (peer, authToken, viewerId, liveId) => {
	try {
    let candidateQueue = [];
    let sendTimeout = null;
		
		peer.onicecandidate = (event) => {
			if (event.candidate) {
        candidateQueue.push(event.candidate);
				
				// Debounce sending so we send in batches every 500ms
        if (!sendTimeout) {
          sendTimeout = setTimeout(async () => {
            const payloadToSend = [...candidateQueue];
            candidateQueue = [];
            sendTimeout = null;
						
						try {
							
							const resultData = await serverConnection(
                '/live-stream-signaling',
                {
                  toUserId: viewerId, 
                  liveId: liveId, 
                  payload: payloadToSend, // Send array of candidates
                  type: 'ice',
                },
                authToken
              );
							//console.log(resultData);
              if (!resultData.status) { 
								console.log('send error to viewer and cancel conneting');
              }
							
						} catch (err) {
							console.log(err); 
							console.log('send error to viewer and cancel conneting');
            }
          }, 500);
        }
      }
    };
	} catch (e) {
    
		console.log(e);
		console.log('send error to viewer and cancel conneting');
  }

};

export default createAndSendICE;
