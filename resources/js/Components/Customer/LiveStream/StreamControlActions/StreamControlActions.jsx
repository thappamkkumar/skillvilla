

import   { useEffect } from 'react';
import { useSelector } from 'react-redux';
import LiveStreamEnd from './LiveStreamEnd';

const StreamControlActions = ({
	peerConRef,
	setShowModel,
	setsubmitionMSG,
}) => {
	
	const liveStreamData = useSelector((state) => state.liveStreamData);
  
	
	return(
		<div className="w-100  position-absolute left-0 bottom-0 z-2    px-3  d-flex justify-content-center align-items-center    ">
			<div 
				className="  d-flex justify-content-center align-items-center flex-wrap gap-2  px-2 py-2 rounded-5  mb-4 bg-secondary bg-opacity-25 " 
			>
				{/*all controlls*/}
				<div className="  d-flex justify-content-center align-items-center flex-wrap gap-2 p-1 overflow-auto    ">
					<span className="btn btn-light rounded-circle">  R</span>  
					<span className="btn btn-light rounded-circle ">M</span> 
					<span className="btn btn-light rounded-circle ">C</span>
					<span className="btn btn-light rounded-circle">  S</span> 
					<span className="btn btn-light rounded-circle">  H</span> 
					
				</div>
				<div className="p-1">
					 
					<LiveStreamEnd 
						peerConRef={peerConRef}
						setShowModel={setShowModel}
						setsubmitionMSG={setsubmitionMSG}
					/>
				</div>
			</div>
		</div>
	);

};

export default StreamControlActions;