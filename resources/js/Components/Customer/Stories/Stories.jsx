 
import  {useState, useEffect, memo, useCallback } from 'react';
 import { useNavigate } from 'react-router-dom'; 
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
 
import handleImageError from '../../../CustomHook/handleImageError'; 
//import manageVisitedUrl from '../../../CustomHook/manageVisitedUrl';  
 
const Stories = ({stories}) => { 
	 
	 
	const [imageLoaded, setImageLoaded] = useState(false); // Track image load state
	const navigate = useNavigate(); //geting reference of useNavigate into navigate
	 
	 
	 
	
	//handle image load indicator
	const handleImageLoad = useCallback(() => {
		setImageLoaded(true); 		
	}, []);
	
	//function to navigate full stroy detail
	const handleNavigateToFullStories = useCallback(() =>
	{ 
		//manageVisitedUrl(`/stories/${stories.id}/detail`, 'append');
		navigate(`/stories/${stories.id}/detail`);	
	}, [ ]);
	
	return (  
			<div className="w-100 px-4 py-3     d-flex justify-content-start align-items-center" onClick={handleNavigateToFullStories}  >
				<div className=" "  > 
						<>
							{!imageLoaded && (
								<div className="spinner-container">
									<Spinner animation="border" role="status" size="sm" variant="secondary" />
								</div>
							)}
							<Image src={stories?.stories[0]?.story_file || '/images/login_icon.png'}
							className="  profile_img "
							onError={()=>{handleImageError(event, '/images/login_icon.png')} }
							alt={`Story of user ${stories.name}, ${stories.id}`} 
							onLoad={handleImageLoad} 
							 style={{ display: imageLoaded ? 'block' : 'none' }} 
							/> 
						</> 
					
				</div>
				<div className=" ps-3  postTruncate" >
					 <strong className="d-block fw-bold postTruncate">{stories.name}</strong>
					 <small>{ stories?.stories[0]?.created_at_human_readable  }</small>

				</div>
				
			</div>
		  
	);
	
};

export default memo(Stories);
