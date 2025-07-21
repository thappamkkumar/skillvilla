import { useCallback, memo,useState,   } from 'react'; 
import { useSelector, useDispatch } from 'react-redux';  
import { useNavigate } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import Image from 'react-bootstrap/Image';   
import Badge from 'react-bootstrap/Badge'; 

import MessageAlert from '../../MessageAlert';
import CommunityActionButton from './CommunityActionButton'; 

import handleLeaveCommunity from './ActionFunction/handleLeaveCommunity';
import handleJoinCommunity from './ActionFunction/handleJoinCommunity';
import handleRequestToJoin from './ActionFunction/handleRequestToJoin';


import { updatePostState } from '../../../StoreWrapper/Slice/TaggedSavedPostSlice';  
import {updateWorkfolioState} from '../../../StoreWrapper/Slice/SavedWorkfolioSlice';
import {updateProblemState} from '../../../StoreWrapper/Slice/SavedProblemSlice';  
import {updateJobState} from '../../../StoreWrapper/Slice/AppliedSavedJobSlice';
import {updateFreelanceState} from '../../../StoreWrapper/Slice/AppliedSavedFreelanceSlice'; 
import {updateCommunityDetailState} from '../../../StoreWrapper/Slice/CommunityDetailSlice'; 
 
 
import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import changeNumberIntoHumanReadableForm from '../../../CustomHook/changeNumberIntoHumanReadableForm'; 
import serverConnection from '../../../CustomHook/serverConnection'; 

const Community = ({ community    }) => {
	
		const authToken = useSelector((state) => state.auth.token); //selecting token from store
	   
    const navigate = useNavigate();
    const dispatch = useDispatch(); //geting reference of useDispatch into dispatch
		const [submitionMSG, setsubmitionMSG] = useState(null); //state for store info about form submition  
		const [showModel, setShowModel] = useState(false); //state for alert message  
		//const [removed, setRemoved] = useState(false);  
		const [submitting, setSubmitting] = useState(false);  
	
    // Navigate to community box
    const handleNavigateToCommunityBox = useCallback(() => {
			dispatch(updatePostState({ type: 'refresh' }));
		  dispatch(updateWorkfolioState({ type: 'refresh' }));
		  dispatch(updateProblemState({ type: 'refresh' }));
			dispatch(updateJobState({ type: 'refresh' }));
			dispatch(updateFreelanceState({ type: 'refresh' }));
			dispatch(updateCommunityDetailState({ type: 'refresh' }));
			
        let url = `/community/${community.id}/detail/posts`;
      //  manageVisitedUrl(url,'append' );
        navigate(url); 
				 
    }, [ community]);

      
		 
		
    return (
        <ListGroup.Item   
            variant="primary"  
           
            id={`chat_${community.id}`}  
            className="RelativeContainer rounded-0 border-0 p-0 customListGroup "  
        >
					<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>
			
				
            <div className="w-100    d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center overflow-hidden py-3 ps-3      w-100"  
								onClick={handleNavigateToCommunityBox} 
								>
                    <Image 
                        src={community.image || '/images/login_icon.png'} 
                        className="profile_img" 
                        onError={(e) => handleImageError(e, '/images/login_icon.png')}
                        alt={`Community image of ${community.id}`} 
												 										
                    /> 
										
                    <div className="ps-3 postTruncate  ">
                        <strong className="d-block fw-bold postTruncate">{community.name}</strong>
                        <small className="d-block   postTruncate">
                            {changeNumberIntoHumanReadableForm(community.members_count)} Members
                        </small>
                    </div>
                </div>
								
								<div className="py-3 pe-3">
									<CommunityActionButton 
											community={community}
											submitting={submitting}
											 
											handleJoinCommunity={() => handleJoinCommunity( community, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken)}
                        
											handleLeaveCommunity={() => handleLeaveCommunity( community, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken)}
                        
											handleRequestToJoin={() => handleRequestToJoin( community, setSubmitting, setsubmitionMSG, setShowModel, dispatch, authToken)}
                    />
								</div>
							{(community.pending_requests_count != null && community.pending_requests_count > 0) && (
										<Badge 
											bg="warning" text="dark" 
											style={{
												position: 'absolute',
												right: '10px',  
												top: '50%',
												transform: 'translateY(-50%)'  
											}}
										>
												{community.pending_requests_count} Request
										</Badge>
								)}	
												 
            </div>
        </ListGroup.Item>
    );
};

export default memo(Community);
