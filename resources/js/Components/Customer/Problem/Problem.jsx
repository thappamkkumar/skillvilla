 
import  {  memo} from 'react';
import PostDate from '../Post/PostDate'; 
 import ProblemHeader from './ProblemHeader';
 import ProblemTotalSolution from './ProblemTotalSolution';
import WorkfolioUploadBy from '../Workfolio/WorkfolioUploadBy';
 
  
 
const Problem = ({problem, chatBox=false}) => { 
	 
	
	return ( 
		<div className="        sub_main_container  p-2 p-md-3 rounded    " >
			
			
			<ProblemHeader title={problem.title} problem_id={problem.id} user_id={problem.user.id} has_saved={problem.has_saved} chatBox={chatBox}  />
			
			<div className="d-flex align-items-center flex-wrap gap-2   py-1  ">
				<WorkfolioUploadBy 
					user={problem.user}  
					id={problem.id}
				/>
				
				 <span className="text-secondary px-2 fs-5">|</span>
				 
				<ProblemTotalSolution solutions_count={problem.solutions_count} />
			 
			</div>
			
			
			
			
			<PostDate  postDate={problem.created_at_human_readable}/> 
	
		 
		</div>
	);
	
};

export default memo(Problem);
