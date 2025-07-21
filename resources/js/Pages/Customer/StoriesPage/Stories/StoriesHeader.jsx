  import   {memo, useCallback}  from 'react';
import { useNavigate } from 'react-router-dom'; 
import Button from 'react-bootstrap/Button'; 
import { BsPlus   } from "react-icons/bs";    
 
//import manageVisitedUrl from '../../../../CustomHook/manageVisitedUrl';

const StoriesHeader = ({canAddStory}) => { 
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
 
	//function use to handle navigation to add new storiy
	const handleNavigateToAddStory = useCallback(()=>{
		// manageVisitedUrl(`/create/story`, 'addNew'); 
		 navigate('/create/story');
		 
	}, []);
 
	  
	return ( 
	 <div className="d-flex justify-content-between align-items-center flex-wrap px-2">
		<h2>Your Story</h2>
		{
			(canAddStory == true) &&
			(	
				<Button  variant="dark" id="addNewStoryBtn" title="Add New Story"  className="  p-1  " onClick={handleNavigateToAddStory}><BsPlus className="fs-4"  style={{ strokeWidth: '1.5',  }}  /> </Button>
			)
		}
		 
					 
				 
			 
			 
	</div>
	);
};

export default memo(StoriesHeader);