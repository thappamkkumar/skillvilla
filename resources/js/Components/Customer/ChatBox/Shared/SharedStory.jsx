import {  memo, useCallback  }  from 'react';    
import { BsLink45Deg } from "react-icons/bs";
import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image'; 

//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';
import handleImageError from '../../../../CustomHook/handleImageError'; 

const SharedStory = ({story}) => {

  const navigate = useNavigate(); //geting reference of useNavigate into navigate

	//function to navigate full stroy detail
	const handleNavigateToFullStories = useCallback(() =>
	{ 
		//manageVisitedUrl(`/stories/${story.user.id}/detail`, 'append');
		navigate(`/stories/${story.user.id}/detail`);	
	}, [story]);
	 
	
	
  return (
	<div className=" mb-2">
		<div  
			className=" w-100  h-auto btn btn-light text-start d-flex     align-items-center"		
			style={{
				maxWidth:'300px', 
				cursor:'pointer'
			}}
			onClick={handleNavigateToFullStories}
		>
			<div className=" "  >  
				<Image src={story.story_file || '/images/login_icon.png'}
				className="  profile_img "
				onError={()=>{handleImageError(event, '/images/login_icon.png')} }
				alt={`Story of user ${story?.user?.name}, ${story?.user?.id}`} 

				/>  
			</div>
			<div className=" ps-3  overflow-hidden" >
				<strong className="d-block fw-semibold text-truncate">{story?.user?.name}</strong>
				<small>{story.created_at_human_readable  }</small> 
			</div>
			
		</div>
		<small className="text-secondary fw-bold"><BsLink45Deg /> Story</small>
		
	</div>
  );
};

export default memo(SharedStory);
