import { memo }  from 'react'; 
 import {   useSelector } from 'react-redux'; 
 
import ProblemList from '../../../Components/Customer/ProblemList/ProblemList';;
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)


const ExploreProblemPage = () => { 
 		const problemList = useSelector((state) => state.problemList);  //selecting   List from store
	
	 
	return ( 
		<>
			<PageSeo 
					title="Explore Problems | SkillVilla"
					description="Find challenges and unsolved problems. Share solutions, get feedback, and level up your problem-solving skills."
					keywords="problems, challenges, explore, skill improvement, innovation, solutions"
			/>

			{
			 (problemList.problemList.length > 0  )  &&
			 (
					<ProblemList problemList={problemList.problemList} />
			 )
		 } 
			
			 
	 </>
	);
};

export default memo(ExploreProblemPage);
