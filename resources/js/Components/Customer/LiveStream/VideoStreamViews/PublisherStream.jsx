

import   { useEffect, memo } from 'react';
import { useSelector } from 'react-redux';

const PublisherStream = ({
	publisherVideoRef,
	localMediaRef,
	setShowModel,
	setsubmitionMSG,
}) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	
	//useEffect for getting media and play localy if logged user is publisher
	useEffect(()=>{ 
		
		  let localStream = null; 
	
		const getPublisherMedia = async( ) => { 
			try
			{ 
				// Get local   stream
				const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
				
				
				localMediaRef.current = localStream; 
				 
				
				const videoOnlyStream = new MediaStream(
					localStream.getVideoTracks()
				);

				if (publisherVideoRef.current) {
					publisherVideoRef.current.srcObject = videoOnlyStream;
				}
			}
			catch(e)
			{
				//console.log(e);
				setsubmitionMSG('Error while fetching media.');
				setShowModel(true);
			}
			
		}; 
		if(logedUserData?.id === liveStreamData?.publisher?.id)
		{
			getPublisherMedia();
		}
		
		
		// cleanup (VERY IMPORTANT)
		return () => {
			if (localStream) {
				localStream.getTracks().forEach(t => t.stop());
			}
		};
		
	}, [ ]); 
	
	return(
		<div className="w-100 h-100  position-absolute left-0 top-0 z-1   ">
			<video  
				className="w-100 h-100 object-fit-cover bg-dark  "
				ref={publisherVideoRef}
				autoPlay
				playsInline 
				muted  
			></video>
		</div>
	);
};

export  default memo(PublisherStream);