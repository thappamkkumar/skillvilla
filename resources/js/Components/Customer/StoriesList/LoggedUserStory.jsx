 
import  {useState, useEffect, memo, useCallback } from 'react';  
 import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
 
import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl'; 
 
const Stories = ({storiesList}) => { 
	 
	 
	const [hasStory, setHasStory] = useState(false);
	const [imageLoaded, setImageLoaded] = useState(false); // Track image load state
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	 
	   
useEffect(()=>{
	if(storiesList.length > 0)
	{ 
		setHasStory(true);
	}
	else
	{
		setHasStory(false);
	}
	
},[storiesList]);
 
//handle image load indicator
	const handleImageLoad = useCallback(() => {
		setImageLoaded(true); 		
	}, []);

	//function to navigate full stroy detail
	const handleNavigateToFullStories = useCallback(() =>
	{  
		if(hasStory == false){return;} 
		//manageVisitedUrl(`/stories/${storiesList[0].user_id}/detail`, 'append');
		navigate(`/stories/${storiesList[0].user_id}/detail`);	
	}, [ hasStory, storiesList]);
	return (  
			<div className="w-100 px-4 py-3  h-auto  d-flex justify-content-start align-items-end  " >
				{
					hasStory
					?(
						<>
							<div className="  " onClick={handleNavigateToFullStories} style={{'cursor':'pointer'}}> 
								<>
									{!imageLoaded && (
										<div className="spinner-container">
											<Spinner animation="border" role="status" size="sm" variant="secondary" />
										</div>
									)}
									<Image src={storiesList[0]?.story_file || '/images/login_icon.png'}
									className="  profile_img "
									onError={()=>{handleImageError(event, '/images/login_icon.png')} }
									alt="Loggeed user Story"
									onLoad={handleImageLoad} 
									 style={{ display: imageLoaded ? 'block' : 'none' }} 
									/> 
								</> 
							
							</div>
							<div className=" ps-3  postTruncate" >
							  <small>{storiesList && storiesList[0] && storiesList[0].created_at_human_readable  }</small>
									 
							</div>
						</>
					):(
						<div className="    " >
							  <p>You haven't posted any stories updates yet.</p>
									 
						</div>
					)
					
				}
				
			</div>
		  
	);
	
};

export default memo(Stories);
