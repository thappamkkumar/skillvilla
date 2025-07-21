import {  memo,    }  from 'react';    
import { BsLink45Deg } from "react-icons/bs";
import Job from '../../CompanyJob/Job'; 

const SharedJob = ({job}) => {

   
	
	
  return (
	<div className="   w-100 mb-2" >
		
		<Job job={job} chatBox={true} />
		<small className="text-secondary fw-bold"> <BsLink45Deg /> Job</small>
		
	</div>
  );
};

export default memo(SharedJob);
