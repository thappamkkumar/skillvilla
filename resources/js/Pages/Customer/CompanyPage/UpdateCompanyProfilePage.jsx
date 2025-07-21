import   {useEffect, useState, useCallback, memo }  from 'react';  
import {  useParams } from 'react-router-dom';  
import {useSelector  } from 'react-redux';
import  Spinner  from 'react-bootstrap/Spinner';  

import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

import UpdateCompanyProfileAbout from '../../../Components/Customer/CompanyProfileUpdate/UpdateCompanyProfileAbout';
import UpdateCompanyProfileBasic from '../../../Components/Customer/CompanyProfileUpdate/UpdateCompanyProfileBasic';
import UpdateCompanyProfileContact from '../../../Components/Customer/CompanyProfileUpdate/UpdateCompanyProfileContact';
 
import serverConnection from '../../../CustomHook/serverConnection'; 
 
const UpdateCompanyProfilePage = (
{ 
}) => {
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
					title={companyProfile?.name ? `Edit ${companyProfile.name} Profile | SkillVilla` : 'Edit Company Profile | SkillVilla'}
					description={companyProfile?.name ? `Update ${companyProfile.name}'s company information and job listings on SkillVilla.` : 'Update and manage your company’s profile on SkillVilla.'}
					keywords={companyProfile?.name ? `edit company, ${companyProfile.name}, SkillVilla, update company` : 'edit company, manage company profile, SkillVilla'}
				/>


        <div className=" pt-2 pt-md-3 pb-5    px-2 px-md-4 px-lg-5  main_container ">
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
											 <h3 className="mb-3 text-center fw-bold" >
												<span className="text-decoration-underline">Update Company Detail</span>
												</h3>
												 
												
												{/*update company  name, industry,  establishedYear */}
												<UpdateCompanyProfileBasic
													name={companyProfile.name}
													industry={companyProfile.industry}  
													establishedYear={companyProfile.established_year} 
												/>
												
												<hr className="my-5" />
												
												{/*update company  description  */}
												<UpdateCompanyProfileAbout 
													description={companyProfile.description}  
												/>
												
												<hr className="my-5" />
												
												{/*update company  contact  */}
												<UpdateCompanyProfileContact  
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

export default memo(UpdateCompanyProfilePage);
