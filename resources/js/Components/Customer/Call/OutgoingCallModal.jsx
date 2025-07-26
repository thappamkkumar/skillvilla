import {   Button,   } from "react-bootstrap";

import { useSelector } from 'react-redux';

import handleImageError from "../../../CustomHook/handleImageError";

const OutgoingCallModal = ( ) => {
   const chatCallData =  useSelector((state) => state.chatCallData); 
	 
	 
	if(chatCallData.callStatus !== "calling") return;
	const backgroundImage = chatCallData.receiver?.image || "/images/profile_icon.png";

	return (
    <div  
			centered 
			className={` fixed-top w-100 h-100 ${chatCallData.callStatus === "calling" ? 'd-flex ':'d-none'} justify-content-center align-items-center   call-container`}
			>
       
				<div 
					className="call-card caller-card rounded" 
					style={{ backgroundImage: `url(${backgroundImage})` }}
				>
					<div 
						className="w-100 h-100   p-3 caller-card-overlay">
						<img
							src={chatCallData.receiver?.image || "/images/profile_icon.png"}
							alt="User Avatar"
							className="rounded-circle img-fluid outgoing-call-avatar mb-3"
							onError={(event) => {
								handleImageError(event, "/images/profile_icon.png");
							}}
						/>
						<h5 className="fw-semibold">{chatCallData.receiver?.name}</h5>
					</div>
        </div>
      
      
    </div>
  );
};

export default OutgoingCallModal;
