
import { useEffect, useState, useRef, useCallback, memo } from 'react';
import { useSelector } from 'react-redux';
import LiveStreamEnd from './LiveStreamEnd';
import ControlActions from './ControlActions/ControlActions';

const StreamControlActions = ({
	peerConRef,
	publisherVideoRef,
	localMediaRef,
	setShowModel,
	setsubmitionMSG,
}) => {
	
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	const [visible, setVisible] = useState(true);
  const timerRef = useRef(null); 
	
	 // Start or restart auto-hide timer 
	const startTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setVisible(false), 30000); // 30 seconds
  }, []);

  // Toggle visibility on interaction
  const handleInteraction = useCallback((event) => {
		if (!publisherVideoRef.current) return;

    // Only toggle if the interaction happened on the video element
    if (!publisherVideoRef.current.contains(event.target)) return;

    setVisible((prev) => {
      if (prev) {
        // If visible ? hide immediately
        if (timerRef.current) clearTimeout(timerRef.current);
        return false;
      } else {
        // If hidden ? show and restart timer
        startTimer();
        return true;
      }
    });
   }, [publisherVideoRef, startTimer]);

  useEffect(() => {
    // Start initial timer
    startTimer();

    if (!publisherVideoRef.current) return;

    // Add event listeners only on publisher video
    const videoEl = publisherVideoRef.current;
    videoEl.addEventListener('pointerdown', handleInteraction);
     
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      videoEl.removeEventListener('pointerdown', handleInteraction);
       
    };
  }, [publisherVideoRef, handleInteraction, startTimer]);

  
  if (!visible) return null; 

	
	return(
		<div   
			 className={`  w-100 position-absolute start-50 bottom-0 z-2 px-3 d-flex justify-content-center align-items-center transition-opacity duration-300 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ pointerEvents: visible ? 'auto' : 'none', transform: 'translateX(-50%)' }}
		
		>
			<div 
				className="  d-flex justify-content-center align-items-center flex-wrap gap-2  px-2 py-2 rounded-5  mb-4 bg-secondary bg-opacity-25 " 
			>
				{/*all controlls*/}
				<div className="  d-flex justify-content-center align-items-center flex-wrap gap-2 p-1 overflow-auto    "> 
					<ControlActions  localMediaRef={localMediaRef} peerConRef={peerConRef}/>
				</div>
				<div className="p-1">
					 
					<LiveStreamEnd 
						peerConRef={peerConRef}
						publisherVideoRef={publisherVideoRef}
						localMediaRef={localMediaRef}
						setShowModel={setShowModel}
						setsubmitionMSG={setsubmitionMSG}
					/>
				</div>
			</div>
		</div>
	);

};

export default memo(StreamControlActions);