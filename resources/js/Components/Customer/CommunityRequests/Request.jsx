 
import {memo, useCallback} from 'react';   
import { useSelector } from 'react-redux';  
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';   
import Badge from 'react-bootstrap/Badge'; 

 import RequestActions from './RequestActions';

//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

const Request = ({request}) => { 
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	const handleNavigateToUserProfile = useCallback(()=>{
		if(logedUserData.id == request.user.id )
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${request.user.userID}/${request.user.id}/profile`, 'append');
			navigate(`/user/${request.user.userID}/${request.user.id}/profile`);
		}
	}, [request.user.id, request.user.userID]);
	 
	return ( 
		 
			 <div
          className="   community_member   user_card     	"  
        >
					 
			
				
            <div className="w-100    d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center overflow-hidden py-3 ps-3     w-100"  
								
								>
                    <Image 
                        src={request.user.customer.image  || '/images/login_icon.png'} 
                        className="profile_img" 
                        onError={(e) => handleImageError(e, '/images/login_icon.png')}
                        alt={`profile image of ${request.user.userID}`}  
												onClick={handleNavigateToUserProfile} 
												style={{cursor:'pointer'}}
                    /> 
                    <div className="ps-3 overflow-hidden  ">
                        <strong 
												className="d-block p-0 m-0  userCard_userName text-truncate"
												onClick={handleNavigateToUserProfile} 
												style={{cursor:'pointer'}}
												>{request.user.userID}  </strong>
                        <small className="d-block p-0 m-0   userCard_userID   text-truncate">
                            { 
															{
																pending: "Pending",
																rejected: "Rejected",
																accepted: "Accepted",
																canceled: "Canceled"
															}[request.status] || "Unknown"
														}
                        </small>
                    </div>
                </div>
								
								<div className="py-3 pe-3    ">
									<RequestActions  request={request} userProfile={handleNavigateToUserProfile} />
								</div>
							 
												 
            </div>
        </div>
			
		 
	);
	
};

export default  memo(Request);


 