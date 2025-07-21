 
import { Route  } from 'react-router-dom';
 

import ProblemPage from '../../Pages/Admin/ProblemPage/ProblemPage';     
import ProblemDetailPage from '../../Pages/Admin/ProblemPage/ProblemDetailPage';     
 
 

const ProblemRoutes = () => (
    <> 
			<Route path="problems" element={<ProblemPage />} />   
			<Route path="problem-detail/:problem_id" element={<ProblemDetailPage />} /> 
		</>
);

export default ProblemRoutes;
