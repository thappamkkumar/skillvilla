 

import   {memo, useState, useCallback, useEffect } from 'react';   

 
const ProblemTotalSolution = ({solutions_count } ) =>
{
	 
	  
	
	return ( 
		 
			<small className="   py-1 px-2 rounded-1  tech_skill "  >{solutions_count} solutions</small>
		 
	);
	
};

export default memo(ProblemTotalSolution);
