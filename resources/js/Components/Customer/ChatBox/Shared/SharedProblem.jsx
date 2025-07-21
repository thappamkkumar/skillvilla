import {  memo,    }  from 'react';    
import Problem from '../../Problem/Problem'; 
import { BsLink45Deg } from "react-icons/bs"; 

const SharedProblem = ({problem}) => { 
	
  return (
		<div className="   w-100 mb-2" > 
			<Problem problem={problem}  chatBox={true} /> 
			<small className="text-secondary fw-bold"><BsLink45Deg /> Problem</small> 
		</div>
  );
};

export default memo(SharedProblem);
