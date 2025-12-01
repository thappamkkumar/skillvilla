 
import {memo,} from 'react';   
 
import QuickLive from '../Live/QuickLive'; 

const QuickLiveList = ({liveList}) => { 
	 
  
	return ( 
		 
			<div className="d-flex d-xl-block gap-1 ">
				 
				{liveList.map((live) => ( 
						
						<div     key={live.id}  className="        ">
						  
							 <QuickLive live={live} />
						</div>
					))} 
					
			</div>
			
		 
	);
	
};

export default  memo(QuickLiveList);


