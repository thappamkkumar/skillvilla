 
import {memo, useCallback, useState} from 'react';   
import { useSelector, useDispatch } from 'react-redux';  
  
import Spinner from 'react-bootstrap/Spinner'; 
import Dropdown from 'react-bootstrap/Dropdown';
import { 
	BsThreeDotsVertical,
	BsPerson,
 // BsShieldLock,
 // BsShieldCheck,
  BsTrash,
  BsFileEarmarkLock,
  BsFileEarmarkArrowUp,   } from "react-icons/bs"; 

import MessageAlert from '../../MessageAlert';
//import handleMemberRoleUpdation from './ActionFunctions/handleMemberRoleUpdation'
import handleContentShareAccessUpdation from './ActionFunctions/handleContentShareAccessUpdation'
import handleRemoveMember from './ActionFunctions/handleRemoveMember'

import { updateCommunityMemberState } from '../../../StoreWrapper/Slice/CommunityMemberSlice';
import {updateCommunityDetailState} from '../../../StoreWrapper/Slice/CommunityDetailSlice';
import {updateCommunityState as updateYourCommunityState} from '../../../StoreWrapper/Slice/YourCommunitySlice';


const MemberActions = ({member, memberProfile }) => { 
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const communityOwner = useSelector((state) => state.communityMemberList.communityOwner);  
	const communityDetail = useSelector((state) => state.communityDetail.communityDetail);  
	const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
	const [showModel, setShowModel] = useState(false); //state for alert message  
	//const [removed, setRemoved] = useState(false);  
	const [submitting, setSubmitting] = useState(false);  
	const [removed, setRemoved] = useState(false);  
	const [membersCount, setMembersCount] = useState(-1);  
	 
	const removeMessageBox = useCallback(()=>{
		if(removed)
		{
			dispatch(updateCommunityMemberState({ type: 'removeMember', memberId: member.id}));
			dispatch(updateCommunityDetailState({
				type: 'memberCountUpdate', 
				membersCount: Math.max(0, membersCount)
			}));
			dispatch(updateYourCommunityState({
					type: 'updateMembersCount',
					updatedMembersCountData: { communityId: communityDetail.id, membersCount: Math.max(0, membersCount) }
			}));
		}
		setShowModel(false);
	}, [removed, member.id]);
	
	
	 
	return ( 
		 <>
			<MessageAlert setShowModel={removeMessageBox} showModel={showModel} message={submitionMSG}/>
			 	<Dropdown className="pe-2  "> 
						 	<Dropdown.Toggle 
								variant="*"
								id={`communityMemberActions${member.id}`} 
								title="more" 
								className="border-0 p-1 userCard_userName custom_dropdown_toggle_post_header  ">
								<BsThreeDotsVertical /> 
							</Dropdown.Toggle>
						 
						<Dropdown.Menu className="p-2 border-0 shadow dropdown_menu" style={{overflow:'hidden',}}> 
								<Dropdown.Item 
									as="button" 
									variant="primary" 
									id={`memberProfile${member.id}`} 
									title={`Profile of ${member.user.userID}`} 
									className="py-2 d-flex align-items-center gap-2  rounded navigation_link" 
									onClick={memberProfile}
								>
									<BsPerson /> <span className="px-2"> Profile</span>	
								</Dropdown.Item>
								{
									communityOwner == logedUserData.id && logedUserData.id != member.user_id &&	
									<>
										{/*
											member.role == 'admin'
											?
											(
												<Dropdown.Item 
													as="button" 
													variant="primary" 
													id={`removeAdmin${member.id}`} 
													title="Revoke Admin Privileges"
													className="py-2 d-flex align-items-center gap-2  rounded navigation_link" 
													onClick={() => 
															handleMemberRoleUpdation( 
															member.id,
															'member', 
															setSubmitting, 
															setsubmitionMSG, 
															setShowModel, 
															dispatch, 
															authToken)}
												>
													 Remove Admin	
												</Dropdown.Item>
											):(
												<Dropdown.Item 
													as="button" 
													variant="primary" 
													id={`addAdmin${member.id}`} 
													title="Grant Admin Privileges" 
													className="py-2 d-flex align-items-center gap-2  rounded navigation_link" 
													onClick={() => 
															handleMemberRoleUpdation( 
															member.id,
															'admin', 
															setSubmitting, 
															setsubmitionMSG, 
															setShowModel, 
															dispatch, 
															authToken)}
												>
													 Make Admin	
												</Dropdown.Item>
												
											)*/
										}
										
										{
											member.can_share_content  
											? (
													<Dropdown.Item 
															as="button" 
															variant="primary" 
															id={`revokeSharing${member.id}`} 
															title="Revoke Content Sharing Access"
															className="py-2 d-flex align-items-center gap-2 rounded navigation_link" 
															onClick={() => 
															handleContentShareAccessUpdation( 
															member.id,
															false, 
															setSubmitting, 
															setsubmitionMSG, 
															setShowModel, 
															dispatch, 
															authToken)}
															 
													>
														<BsFileEarmarkLock  /> <span className="px-2">	Revoke Sharing</span>
													</Dropdown.Item>
											) : (
													<Dropdown.Item 
															as="button" 
															variant="primary" 
															id={`grantSharing${member.id}`} 
															title="Grant Content Sharing Access" 
															className="py-2 d-flex align-items-center gap-2 rounded navigation_link" 
															onClick={() => 
															handleContentShareAccessUpdation( 
															member.id,
															true, 
															setSubmitting, 
															setsubmitionMSG, 
															setShowModel, 
															dispatch, 
															authToken)}
													>
														<BsFileEarmarkArrowUp  /> <span className="px-2"> Allow Sharing</span>
													</Dropdown.Item>
											)
										}
										
										<Dropdown.Item 
												as="button" 
												variant="primary" 
												id={`removeMember${member.id}`} 
												title="Remove Member from Community" 
												className="py-2 d-flex align-items-center gap-2 rounded navigation_link" 
												onClick={() => 
															handleRemoveMember( 
															member.id, 
															setMembersCount, 
															setRemoved, 
															setSubmitting, 
															setsubmitionMSG, 
															setShowModel,  
															authToken)}
										>
											<BsTrash  /> <span className="px-2">	Remove Member</span>
										</Dropdown.Item>

													
									
									</>
								}
							 
						</Dropdown.Menu>
					</Dropdown>
		</>		
			
		 
	);
	
};

export default  memo(MemberActions);


 