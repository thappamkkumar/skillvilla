 
import { Route  } from 'react-router-dom';
 

import CompanyPage from '../../Pages/Admin/CompanyPage/CompanyPage';     
import CompanyProfilePage from '../../Pages/Admin/CompanyPage/CompanyProfilePage';     
 
 

const CompanyRoutes = () => (
    <> 
			<Route path="companies" element={<CompanyPage />} />   
			<Route path="company-detail/:company_id" element={<CompanyProfilePage />} />
		</>
);

export default CompanyRoutes;
