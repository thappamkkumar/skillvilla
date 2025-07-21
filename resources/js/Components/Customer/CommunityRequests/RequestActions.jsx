 
import {memo, useCallback, useState} from 'react';   
import { useSelector, useDispatch } from 'react-redux';  
  
import Spinner from 'react-bootstrap/Spinner'; 
import Dropdown from 'react-bootstrap/Dropdown';
import {BsThreeDotsVertical,  BsPerson, BsCheckCircle, BsXCircle, BsTrash} from "react-icons/bs";

import updateRequestStatus from './ActionFunctions/updateRequestStatus';
import MessageAlert from '../../MessageAlert';
 
import { updateCommunityRequestState } from '../../../StoreWrapper/Slice/CommunityRequestSlice';

const RequestActions = ({request, userProfile }) => { 

	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	//const [removed, setRemoved] = useState(false);  
	const [submitting, setSubmitting] = useState(false);  
	const [removed, setRemoved] = useState(false);  
	 
	  
	 const removeRequest = useCallback(()=>{
		 if(removed)
		 {
			 //remove request from list after accepting
				dispatch(updateCommunityRequestState(
					{ 
						type: 'removeRequest', 
						requestId: request.id
					}
				)); 
		 }
		 setShowModel(false);
	 },[removed, request.id]);
	return ( 
		 <>
			<MessageAlert setShowModel={removeRequest} showModel={showModel} message={submitionMSG}/>
			 	<Dropdown className="pe-2  "> 
						 	<Dropdown.Toggle 
								variant="*"
								id={`communityMemberActions${request.id}`} 
								title="more" 
								className="border-0 p-1 userCard_userName custom_dropdown_toggle_post_header  ">
								<BsThreeDotsVertical /> 
							</Dropdown.Toggle>
						 
						<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}> 
								<Dropdown.Item 
									as="button" 
									variant="primary" 
									id={`userProfile${request.id}`} 
									title={`Profile of ${request.user.userID}`} 
									className="py-2 d-flex align-items-center gap-2  rounded navigation_link" 
									onClick={userProfile}
								>
									 <BsPerson /> <span className="px-2">Profile	</span>
								</Dropdown.Item>
								
								{(request.status === 'pending' || request.status === 'rejected') && (
									<>
											{/* Accept Request (Visible for 'pending' and 'rejected') */}
											<Dropdown.Item
													as="button"
													variant="success"
													id={`acceptRequest${request.id}`}
													title={`Accept request of ${request.user.userID}`}
													className="py-2 d-flex align-items-center gap-2 rounded navigation_link"
													onClick={() => updateRequestStatus(
															request.id,
															request.community_id,
															"accepted",
															setSubmitting,
															setsubmitionMSG,
															setShowModel,
															dispatch,
															authToken,
															setRemoved  
													)}
											>
													<BsCheckCircle /> <span className="px-2">Accept Request</span>
											</Dropdown.Item>

											{/* Reject Request (Visible only for 'pending') */}
											{request.status === 'pending' && (
													<Dropdown.Item
															as="button"
															variant="danger"
															id={`rejectRequest${request.id}`}
															title={`Reject request of ${request.user.userID}`}
															className="py-2 d-flex align-items-center gap-2 rounded navigation_link"
															onClick={() => updateRequestStatus(
																	request.id,
																	request.community_id,
																	"rejected",
																	setSubmitting,
																	setsubmitionMSG,
																	setShowModel,
																	dispatch,
																	authToken,
																	setRemoved 
															)}
													>
															<BsXCircle /> <span className="px-2">Reject Request</span>
													</Dropdown.Item>
											)}

											{/* Cancel Request (Visible for 'pending' and 'rejected') */}
											<Dropdown.Item
													as="button"
													variant="danger"
													id={`cancelRequest${request.id}`}
													title={`Cancel request of ${request.user.userID}`}
													className="py-2 d-flex align-items-center gap-2 rounded navigation_link"
													onClick={() => updateRequestStatus(
															request.id,
															request.community_id,
															"canceled",
															setSubmitting,
															setsubmitionMSG,
															setShowModel,
															dispatch,
															authToken,
															setRemoved 
													)}
											>
													<BsTrash /> <span className="px-2">Cancel Request</span>
											</Dropdown.Item>
									</>
							)}

								 
							 
						</Dropdown.Menu>
					</Dropdown>
		</>		
			
		 
	);
	
};

export default  memo(RequestActions);


 