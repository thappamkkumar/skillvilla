 import { memo }  from 'react';  
 import {   useSelector } from 'react-redux'; 
 
 import FreelanceList from '../../../Components/Customer/FreelanceList/FreelanceList';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


const ExploreFreelancePage = () => { 
 		const freelanceList = useSelector((state) => state.freelanceList); //selecting   List from store
	
	 
	return ( 
		<>
			 <PageSeo 
					title="Explore Freelance Gigs | SkillVilla"
					description="Browse short-term freelance gigs and remote opportunities that match your skill set and availability."
					keywords="freelance gigs, explore gigs, side jobs, remote work, opportunities"
				/>

			{
			 (freelanceList.freelanceList.length > 0  )  &&
			 (
					<FreelanceList freelanceList={freelanceList.freelanceList} />
			 )
		 } 
			
			 
	 </>
	);
};

export default memo(ExploreFreelancePage);
