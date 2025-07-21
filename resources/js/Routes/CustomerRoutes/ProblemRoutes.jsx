import { lazy } from 'react';
import { Route, Navigate } from 'react-router-dom';
 
import AddProblemPage from '../../Pages/Customer/ProblemPage/AddProblemPage';
import ProblemDetailPage from '../../Pages/Customer/ProblemPage/ProblemDetailPage';


const ProblemPage = lazy(() => import('../../Pages/Customer/ProblemPage/ProblemPage')); 
const UserProblemPage = lazy(() => import('../../Pages/Customer/ProblemPage/UserProblemPage')); 
const MyProblemPage = lazy(() => import('../../Pages/Customer/ProblemPage/MyProblemPage')); 
const SavedProblemPage = lazy(() => import('../../Pages/Customer/ProblemPage/SavedProblemPage')); 
 

const ProblemRoutes = () => (
    <> 
			 	<Route path="problems" element={<ProblemPage />} />
				<Route path="problems/my-problems" element={<MyProblemPage />} />
				<Route path="problems/saved" element={<SavedProblemPage />} />
				<Route path="user/:userId/:ID/problems" element={<UserProblemPage />} />
				<Route path="problems/add-new" element={<AddProblemPage />} />
				<Route path="problem-detail/:problem_id" element={<ProblemDetailPage />} />
										
															
		</>
);

export default ProblemRoutes;
