import { memo }  from 'react'; 
 import {   useSelector } from 'react-redux'; 
 
import WorkfolioList from '../../../Components/Customer/WorkfolioList/WorkfolioList';
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


const ExploreWorkfolioPage = () => { 
 		const workfolioList = useSelector((state) => state.workfolioList); //selecting   List from store
	
	 
	return ( 
	<>
			<PageSeo 
					title="Explore Workfolios | SkillVilla"
					description="Explore portfolios from professionals showcasing their best work, skills, and experience across fields."
					keywords="workfolio, portfolios, showcase, design, development, projects, explore"
				/>
 
			{
			 (workfolioList.workfolioList.length > 0  )  &&
			 (
					<WorkfolioList workfolioList={workfolioList.workfolioList} />
			 )
		 } 
			
			 
	</>
	);
};

export default memo(ExploreWorkfolioPage);
