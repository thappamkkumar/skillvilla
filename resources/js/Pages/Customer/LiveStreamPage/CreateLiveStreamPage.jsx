 

import   {memo,useState  } from 'react';   

import { useNavigate } from 'react-router-dom';
 
import PageSeo from '../../../Components/Common/PageSeo';  // for SEO, change document title and meta data (name and description of meta data)
import QuickLiveStream from '../../../components/Customer/CreateLiveStream/QuickLiveStream';
import ProfessionalLiveStream from '../../../components/Customer/CreateLiveStream/ProfessionalLiveStream';
 
import MessageAlert from '../../../Components/MessageAlert';


const AddStoriesPage = ( ) => {
	const [submitionMSG, setsubmitionMSG] = useState(null); //state for store  msg to show
	const [showModel, setShowModel] = useState(false); //state for show/hide alert message  
	 


 
	return ( 
		<>
			<PageSeo 
					title="Go Live | SkillVilla"
					description="Go live casualy or professionaly to inspire and conncet with others on SkillVilla."
					keywords="quick live, professional live, connect with users, share knowladge and skills, broadcast, create network, SkillVilla, share experience   "
			/>

			<MessageAlert setShowModel={setShowModel} showModel={showModel} message={submitionMSG}/>	
				
			<div className="mx-auto py-4   py-md-4 py-lg-5   px-2   px-sm-3 px-md-4 px-lg-5  rounded sub_main_container">
				 
				<QuickLiveStream  setShowModel={setShowModel} setsubmitionMSG={setsubmitionMSG} />
				
				<ProfessionalLiveStream  setShowModel={setShowModel} setsubmitionMSG={setsubmitionMSG} />
					 
					
				 
			</div>
						 
				
				 
				  
			 
		</>
	);
	
};

export default memo(AddStoriesPage);
