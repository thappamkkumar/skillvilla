 
import {memo,    useCallback } from 'react'; 
import {useSelector    } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button';
import Image from 'react-bootstrap/Image';
 
   
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import handleImageError from '../../../CustomHook/handleImageError';


const UserCompany= ({ company }) => { 
	
	const logedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info  
 	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	 
	 
	 
	   
	//function use to navigate to  company profile
	const handleNavigateToCompanyProfile = useCallback(async()=>{ 
	//	manageVisitedUrl(`/company-profile/${company.id}`, 'append');
		navigate(`/company-profile/${company.id}`);
	}, [company]);
	
	 
	 
	return ( 
		<div 
			className="px-2 "> 
		
			<strong className="d-block">Working For </strong>
			<div 
			className="d-inline-flex align-items-start gap-3 pt-2 overflow-hidden "
			onClick={handleNavigateToCompanyProfile}
			style={{cursor:'pointer'}}
			 title={`View profile of ${company.name}`}
			>
				<Image
					 src={company.logo || '/images/login_icon.png'}
					className="comment_profile_image"
					onError={(event) => handleImageError(event, '/images/login_icon.png')}
					alt={`Profile image of ${company.name}`}
					 
				/>
				<span 
					className=" text-truncate  post_tags" 
				>
					{company.name}
				</span>
			</div>
			
    </div>
		 
			 
	);
	
};

export default memo(UserCompany);
