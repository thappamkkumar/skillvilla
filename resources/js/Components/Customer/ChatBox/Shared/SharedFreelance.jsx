import {  memo,    }  from 'react';    
import { BsLink45Deg } from "react-icons/bs";  
import Freelance from '../../Freelance/Freelance'; 

const SharedFreelance = ({freelance}) => {

   
	
	
  return (
	<div className="   w-100 mb-2" >
		
		<Freelance freelance={freelance}  chatBox={true}  /> 
		<small className="text-secondary fw-bold"><BsLink45Deg /> Freelance</small>
		
	</div>
  );
};

export default memo(SharedFreelance);
