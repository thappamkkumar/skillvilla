import { memo }  from 'react'; 
 import {   useSelector } from 'react-redux'; 
  
import Workfolio from '../../../../Components/Customer/Workfolio/Workfolio';
import Sender from '../../../../Components/Customer/CommunityDetail/Sender';   

const CommunityWorkfolioPage = () => {
 	const workfolioList = useSelector((state) => state.savedWorkfolioList); //selecting   List from store
	
	 
	return ( 
		 <>
			 
			{
			 (workfolioList.workfolioList.length > 0  )  &&
			 (
					<div className="  px-0 py-3 px-sm-3 px-md-4 px-lg-5          ">
				 
				{workfolioList.workfolioList.map((workfolio, index) => ( 
						
						<div     key={index}   style={{  maxWidth:'100%',}}   >
							{
								workfolio.deleted != null && workfolio.deleted == true ? (
									 
										<h5 className="py-5 px-2 m-0 mb-2 rounded text-muted workfolio">This work is no longer available.</h5>
									 
									  
								) : (
									<>
										<Workfolio workfolio={workfolio}   />
										<Sender 
											user={workfolio.sender} 
											style="d-inline-flex   my-2     "
										/>			
									</>
								)
							}
							 
						</div>
					))} 
					
			</div>
			 )
		 } 
			
			 
		</>
  );
};

export default memo(CommunityWorkfolioPage);
