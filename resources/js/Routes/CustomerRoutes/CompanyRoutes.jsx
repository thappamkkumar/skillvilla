import { lazy } from 'react';
import { Route,   } from 'react-router-dom';



import CompanyProfilePage from '../../Pages/Customer/CompanyPage/CompanyProfilePage';  
import UpdateCompanyProfilePage from '../../Pages/Customer/CompanyPage/UpdateCompanyProfilePage'; 


const CompanyRoutes = () => (
    <> 
			
			<Route path="company-profile/:company_id" element={<CompanyProfilePage />} />
			<Route path="update-company-profile/:company_id" element={<UpdateCompanyProfilePage />} />
										  					
		</>
);

export default CompanyRoutes;
