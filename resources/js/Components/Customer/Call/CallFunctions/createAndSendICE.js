import serverConnection from '../../../../CustomHook/serverConnection';
import { updateChatCallState } from '../../../../StoreWrapper/Slice/ChatCallSlice';

const createAndSendICE = async (peerConRef, authToken, chatCallData, dispatch, caller = false) => {
  try {
    let candidateQueue = [];
    let sendTimeout = null;

    peerConRef.current.onicecandidate = (event) => {
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
                '/call/signal',
                {
                  toUserId: caller ? chatCallData.receiver.id : chatCallData.caller.id,
                  call_id: chatCallData.callId,
                  payload: payloadToSend, // Send array of candidates
                  type: 'ice',
                },
                authToken
              );
							//console.log(resultData);
              if (!resultData.status) {
                dispatch(
                  updateChatCallState({
                    type: 'setError',
                    error: 'Face issue while connecting.',
                  })
                );
              }
            } catch (err) {
              dispatch(
                updateChatCallState({
                  type: 'setError',
                  error: 'Face issue while connecting.',
                })
              );
            }
          }, 500);
        }
      }
    };
  } catch (e) {
    dispatch(
      updateChatCallState({
        type: 'setError',
        error: 'Face issue while connecting.',
      })
    );
  }
};

export default createAndSendICE;
