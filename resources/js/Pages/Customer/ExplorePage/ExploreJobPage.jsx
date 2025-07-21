 import { memo }  from 'react';
 import {   useSelector } from 'react-redux'; 
 
 import JobList from '../../../Components/Customer/CompanyJobList/JobList';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)

const ExploreJobPage = () => { 
 		const jobList = useSelector((state) => state.jobList); //selecting   List from store
	
	 
	return ( 
		<>
			<PageSeo 
				title="Explore Jobs | SkillVilla"
				description="Discover job openings curated for creators, freelancers, and professionals. Apply and grow your career."
				keywords="jobs, job board, hiring, freelance, explore jobs, remote work"
			/>

			{
			 (jobList.jobList.length > 0  )  &&
			 (
					<JobList jobList={jobList.jobList} />
			 )
		 } 
			
			 
		</>
	);
};

export default memo(ExploreJobPage);
