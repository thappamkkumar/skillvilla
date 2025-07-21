 
import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams } from 'react-router-dom';  
import {useSelector  } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner'; 
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

 import CompanyProfileHeader from '../../../Components/Customer/CompanyProfile/CompanyProfileHeader';
 import CompanyProfileAbout from '../../../Components/Customer/CompanyProfile/CompanyProfileAbout';
 import CompanyProfileContact from '../../../Components/Customer/CompanyProfile/CompanyProfileContact';
 
 
import serverConnection from '../../../CustomHook/serverConnection'; 
 
 

const CompanyProfilePage = () => { 
	const { company_id } = useParams(); // get id from URL parameter
	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [companyProfile, setCompanyProfile] = useState(null);
	 const [loading, setLoading] = useState(false);
	 
	 

	 
	//function for fetching data
	const apiCall = useCallback(async()=>{ 
		try
		{ 
	 
			 
			setLoading(true);
			if(company_id == null || authToken == null)
			{
				return;
			}
			let requestData = {company_id: company_id, } ;
			let url = `/get-company-profile`;
			 
			 
			//call the function fetch post data fron server
			let data = await serverConnection(url,requestData, authToken);
			 
			 
			 //console.log(data);
			 
			 if(data != null && data.companyProfile != null )
			 {     
					setCompanyProfile(data.companyProfile)
			 } 
			 setLoading(false);
		}
		catch(error)
		{
			//console.log(error);
			setLoading(false);
		}
			
	},[ authToken, company_id]); 

	useEffect(() => {  
		// Create a cancel token source
		let source = axios.CancelToken.source(); 
		 
			apiCall(); 
		 
		return () => {
				// Cancel the request when the component unmounts 
        source.cancel('Request canceled due to component unmount '); 
    };
	}, [authToken, company_id]);
	
	 
 	
 
	 
	 
	return (
		<>
			<PageSeo 
				title={companyProfile?.name ? `${companyProfile.name} | Company Profile | SkillVilla` : 'Company Profile | SkillVilla'}
				description={companyProfile?.name ? `Explore job listings and details from ${companyProfile.name} on SkillVilla.` : 'Explore a company’s profile, job listings, and team on SkillVilla.'}
				keywords={companyProfile?.name ? `company profile, ${companyProfile.name}, SkillVilla, hiring company` : 'company profile, SkillVilla, company details'}
			/>


			<div   className="  pt-2 pt-md-3 pb-5    px-2 px-md-4 px-lg-5  main_container   "  > 
				{
					loading ?
					(
						<div className="w-100 text-center py-4"><Spinner  animation="border" size="md" /></div>
					)
					:
					(
						 
								(companyProfile != null) ?
								(
									<div className="w-100 m-auto px-2 px-md-4 px-lg-5 py-2 py-md-4 py-lg-5 sub_main_container rounded   ">
										 
										<CompanyProfileHeader 
											companyId={companyProfile.id}
											userId={companyProfile.user_id}
											logo={companyProfile.logo}
											name={companyProfile.name}
											industry={companyProfile.industry}
											setCompanyProfile={setCompanyProfile}
										/>
										
										<hr className="my-5"/>
									 
										<CompanyProfileAbout
											description={companyProfile.description}
											establishedYear={companyProfile.established_year}
											managedBy={companyProfile.user}
										/>
										
										<hr className="my-5"/>
										
										<CompanyProfileContact
											address={companyProfile.address}
											email={companyProfile.email}
											phone={companyProfile.phone}
											website={companyProfile.website}
										/>
										
									 
								</div>
								):
								(
									<p className="no_posts_message">This Company is no longer available.</p>
								)		
							 
					)
			 }
			</div>
		</>
	);
};

export default memo(CompanyProfilePage);
