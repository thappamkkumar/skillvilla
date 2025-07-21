 import { memo }  from 'react';  
 import {   useSelector } from 'react-redux'; 
 
  
import Freelance from '../../../../Components/Customer/Freelance/Freelance';
import Sender from '../../../../Components/Customer/CommunityDetail/Sender'; 
 
const CommunityFreelancePage = () => { 
 		const freelanceList = useSelector((state) => state.appliedSavedFreelanceList); //selecting   List from store
	
	 
	return ( 
		 <>
			 
			{
			 (freelanceList.freelanceList.length > 0  )  &&
			 (
					<div className="  px-0 py-3 px-sm-3 px-md-4 px-lg-5          "   >
				 
						{freelanceList.freelanceList.map((freelance, index) => ( 
								
								<div key={index}   style={{  maxWidth:'100%',}}   >
									{
										freelance.deleted != null && freelance.deleted == true ? (
											
												<h5 className="py-5 px-2 m-0 mb-2 rounded text-muted workfolio  ">This freelance work is no longer available.</h5>
											 
												
										) : (
											 
											<>
												<Freelance freelance={freelance}   />
												<Sender 
													user={freelance.sender} 
													style="d-inline-flex  my-2     "
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

export default memo(CommunityFreelancePage);
