 
import {memo, useCallback} from 'react';   
import { useSelector } from 'react-redux';  
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image';   
import Badge from 'react-bootstrap/Badge'; 

import MemberActions from './MemberActions';

import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 

const Member = ({member}) => { 
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	const handleNavigateToUserProfile = useCallback(()=>{
		if(logedUserData.id == member.user.id )
		{
			//call function to add current url into array of visited url
		//	manageVisitedUrl('/profile', 'addNew');
			navigate('/profile');
		}
		else
		{
			//call function to add current url into array of visited url
			//manageVisitedUrl(`/user/${member.user.userID}/${member.user.id}/profile`, 'append');
			navigate(`/user/${member.user.userID}/${member.user.id}/profile`);
		}
	}, [member.user.id, member.user.userID]);
	 
	return ( 
		 
			 <div
          className="   community_member   user_card     	"  
        >
					 
			
				
            <div className="w-100    d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center overflow-hidden py-3 ps-3     w-100"  
								onClick={handleNavigateToUserProfile} 
								style={{cursor:'pointer'}}
								>
                    <Image 
                        src={member.user.customer.image || '/images/login_icon.png'} 
                        className="profile_img" 
                        onError={(e) => handleImageError(e, '/images/login_icon.png')}
                        alt={`profile image of ${member.user.userID}`}  
                    /> 
                    <div className="ps-3 overflow-hidden  ">
                        <strong className="d-block p-0 m-0  userCard_userName text-truncate">{member.user.userID}  </strong>
                        <small className="d-block p-0 m-0  userCard_userID    text-truncate">
                           {member.role === "admin" ? "Admin" : "Member"}
                        </small>
                    </div>
                </div>
								
								<div className="py-3 pe-3  ">
									 <MemberActions member={member} memberProfile={handleNavigateToUserProfile}/>
								</div>
							 
												 
            </div>
        </div>
			
		 
	);
	
};

export default  memo(Member);


 