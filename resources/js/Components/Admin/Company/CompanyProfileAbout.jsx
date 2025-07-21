 
import   {memo,useCallback} from 'react';   

import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image'; 

import LargeText from '../../Common/LargeText';
import WorkfolioUploadBy from '../../Customer/Workfolio/WorkfolioUploadBy';

//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
import handleImageError from '../../../CustomHook/handleImageError'; 

const CompanyProfileAbout = ({ description, establishedYear, 	managedBy }) =>
{
	
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	
	
	//handle navigate to user profile
	const handlenavigateToProfile = useCallback(()=>
	{
		 
		// manageVisitedUrl(`/admin/user-profile/${managedBy.userID}/${managedBy.id}`, 'append');
		navigate(`/admin/user-profile/${managedBy.userID}/${managedBy.id}`);
		 
	},[managedBy]);
	 
	  
	 
	return(
		<div className="w-100 h-auto  ">
			<h3 className="mt-0 pt-0">About  </h3>
			<p><strong>Description:</strong>   {description ? <LargeText largeText={description} /> :  "No information provided."}</p>
			 
			<p className=" "><strong>Established Year:</strong> {establishedYear}</p>
			<div className=" d-flex gap-2 align-items-center">
			<strong>Handle By:</strong> 
			
			<div 
				className="d-flex align-items-center  "
				onClick={handlenavigateToProfile}
				style={{cursor:'pointer'}}
			> 
			
				<Image
					src={managedBy?.customer?.image || '/images/login_icon.png'}
					className="comment_profile_image"
					onError={(event) => handleImageError(event, '/images/login_icon.png')}
					alt={`profile image of ${managedBy.name}`}
					 
				/>
				<span
					 
					title={`View profile of ${managedBy.userID}`}
					className="p-0 px-2 text-decoration-underline post_tags" 
				>
					{managedBy.userID}
				</span>
				
			</div>
			
			</div>
		</div>
		
		 
	);
};

export default memo(CompanyProfileAbout);