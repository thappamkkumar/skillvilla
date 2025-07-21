import {  memo,    }  from 'react';    
import Workfolio from '../../Workfolio/Workfolio'; 
import { BsLink45Deg } from "react-icons/bs";

const SharedWorkfolio = ({workfolio}) => { 
	
  return (
		<div className="   w-100 mb-2" > 
			<Workfolio workfolio={workfolio}  chatBox={true} /> 
			<small className="text-secondary fw-bold"><BsLink45Deg /> Workfolio</small> 
		</div>
  );
};

export default memo(SharedWorkfolio);
