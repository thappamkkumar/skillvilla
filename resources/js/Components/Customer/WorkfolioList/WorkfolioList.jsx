 
import {memo, useEffect} from 'react';   
import Workfolio from '../Workfolio/Workfolio'; 

const WorkfolioList = ({workfolioList}) => { 
	 
  
	return ( 
		 
			<div className="  px-0 py-3 px-sm-3 px-md-4 px-lg-5          ">
				 
				{workfolioList.map((workfolio) => ( 
						
						<div  className=" mb-3 "   key={workfolio.id}   style={{  maxWidth:'100%',}}   >
							{
								workfolio.deleted != null && workfolio.deleted == true ? (
									 
										<h5 className="py-5 px-2 px-md-3 m-0   rounded text-muted workfolio">This work is no longer available.</h5>
									 
									  
								) : (
									<Workfolio workfolio={workfolio}   />
								)
							}
							 
						</div>
					))} 
					
			</div>
			
		 
	);
	
};

export default  memo(WorkfolioList);
