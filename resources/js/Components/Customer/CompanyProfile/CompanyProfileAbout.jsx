 
import   {memo } from 'react';   

import LargeText from '../../Common/LargeText';
import WorkfolioUploadBy from '../Workfolio/WorkfolioUploadBy';
const CompanyProfileAbout = ({ description, establishedYear, 	managedBy }) =>
{
	 
	 
	return(
		<div className="w-100 h-auto  ">
			<div className=" d-flex gap-3 align-items-center mb-2">
				<h6 className="m-0 p-0"><strong>Handle By : </strong> </h6>  
				<WorkfolioUploadBy user={managedBy}  /> 
			</div>
			
			<div className="d-flex gap-3 mb-2 align-items-center ">
				<h6 className="m-0 p-0"><strong>Established Year : </strong> </h6> 
				<p className="m-0 p-0">{establishedYear} </p>
			</div>
			
			
			<hr className="m-0 my-5"/>
			
			<div className="      ">  
				<h5	>About: </h5>
				{description ? <LargeText largeText={description} /> :  "No information provided."} 
 			</div>
			
		</div>
		
		 
	);
};

export default memo(CompanyProfileAbout);