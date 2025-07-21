 
import   {memo,useCallback } from 'react';   
import {useSelector  } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Image from 'react-bootstrap/Image'; 
import Button from 'react-bootstrap/Button';

import {BsPencilFill } from 'react-icons/bs';
  
 
import UpdateCompanyProfileLogo from '../CompanyProfileUpdate/UpdateCompanyProfileLogo';

import handleImageError from '../../../CustomHook/handleImageError';  
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';
import serverConnection from '../../../CustomHook/serverConnection';

const CompanyProfileHeader = (
{ 
	companyId,
	userId,
	logo,
	name,
	industry,
	setCompanyProfile,
}) =>
{
	  const loggedUserData = JSON.parse(useSelector((state) => state.auth.user));//get login info 
		const navigate = useNavigate(); //geting reference of useNavigate into navigate
	

	 const handleNavigateToUpdteProfile = useCallback(()=>{
		//manageVisitedUrl(`/update-company-profile/${companyId}`, 'append');
		navigate(`/update-company-profile/${companyId}`);
	 },[companyId ]);
	 
	return(
	
			<div className={`d-sm-flex   align-items-start   w-100 ${loggedUserData.id != userId && 'align-items-center'}   `}  >  
				<div className="profile_image_container  mx-auto mx-sm-0    RelativeContainer">
					<Image  
						src={logo || '/images/profile_icon.png' }
						key={logo || "default-key"} 
						className="profile_image  d-block mx-auto mx-md-0 p-0 "
						onError={(event)=>{ handleImageError(event, '/images/profile_icon.png')} }
						alt={`Logo of ${name}`}      />
							
						{
							loggedUserData.id == userId &&
							(
							
								<UpdateCompanyProfileLogo
									id={companyId} 
									setCompanyProfile={setCompanyProfile} 
								/>
							)
						}
						
					 
				</div>	
					
				<div className="ps-sm-3  ps-lg-5 pt-3 pt-sm-0 d-flex d-sm-block flex-column   align-items-center    ">
					<h3 className=" m-0 pt-3 pt-md-0 pb-2 text-center text-sm-start userCard_userName">{name} </h3>
					<h5 className="   m-0  text-center text-sm-start  userCard_userID ">{industry}</h5>
					
					{
						loggedUserData.id == userId &&
						(
							<div className="py-3  ">
								<Button variant="dark" onClick={handleNavigateToUpdteProfile} className="    px-5 mx-auto"  id="editCompanyProfile" title="Edit Company Profile"> Edit <BsPencilFill className="mb-1 ms-2" /></Button>
							</div>
						)
					}
					
					 
					
					
							 
					 
				
				</div>
				 
	</div>
	
	
	
	
		 
	);
};

export default memo(CompanyProfileHeader);