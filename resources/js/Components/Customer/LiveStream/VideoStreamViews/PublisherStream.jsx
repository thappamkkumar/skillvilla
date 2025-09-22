

import   { useEffect, memo } from 'react';
import { useSelector } from 'react-redux';

const PublisherStream = ({
	publisherVideoRef,
	setShowModel,
	setsubmitionMSG,
}) => {
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	
	//useEffect for getting media and play localy if logged user is publisher
	useEffect(()=>{ 
		const getPublisherMedia = async( ) => { 
			try
			{ 
				// Get local   stream
				//const localStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
				if (publisherVideoRef.current) { 
					//publisherVideoRef.current.srcObject = localStream; 
					console.log('uncomment above live');
					setsubmitionMSG('publisher media start.');
					setShowModel(true);
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
	
	}, [logedUserData,liveStreamData]); 
	
	return(
		<div className="w-100 h-100  position-absolute left-0 top-0 z-1   ">
			<video  
				className="w-100 h-100 object-fit-cover   "
				ref={publisherVideoRef}
				autoPlay
				playsInline
				loop={true}
				muted 
				style={{ backgroundColor: "#000" }}
			></video>
		</div>
	);
};

export  default memo(PublisherStream);