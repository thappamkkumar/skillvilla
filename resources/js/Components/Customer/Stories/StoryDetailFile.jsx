 
import { useState, useEffect, memo, useCallback} from 'react';      
import ReactPlayer from 'react-player';
import Image from 'react-bootstrap/Image';  
import Spinner from 'react-bootstrap/Spinner'; 

  
import handleImageError from '../../../CustomHook/handleImageError'; 
   

const StoryDetailFile = ({ storyId, file,type }) => { 
	
	 const [isPlaying, setIsPlaying] = useState(false);//state for store video is playing or not
	const [loading, setLoading] = useState(true);//state for store data is loading 
	const [error, setError] = useState(false);//state for error
  
  
   
  
		//handle video is play or pause
	const handlePlayPause = useCallback(() => {
    setIsPlaying(!isPlaying);
  },[]);
	
	//handle loader if data is loading
	const setLoad = useCallback(() => { 
    setLoading(false); 
  },[]);
	  
	//handle loader if data is loading
	const handleError = useCallback(() => { 
    setError(true); 
  },[]);
	  
  
  
	return ( 
		 
			 
	<div className="bg-light  postDetailAttachmentContainer  " >
				{type ==  'mp4' ? 
					(
						!error ? 
						(
							<div className="w-100  postDetailAttachment">
								<ReactPlayer 
								url={file}
								loop={false}
								width="100%"
								height="100%"
								playing={false}
								controls={true} 
								onReady={setLoad}
								onError={()=>{handleError(); setLoad();} }
								/>
							</div>
						):(
							<Image src="/images/imageError.jpg" onError={()=>{console.log('error occure while loading image')} } id={`errorImage ${storyId}`} alt="Video is not fount of post " className="postDetailAttachment"   fluid />
						)
						
					):(
					
						<Image src={file || '/images/imageError.jpg'} onError={()=>{handleImageError(event, '/images/imageError.jpg'); setLoad();} } id={`storyImage${storyId}`} alt={`Story image ${storyId}`}className="postDetailAttachment" onLoad={setLoad} fluid />
					
					) 
				}
				
				{loading &&
					<div className="w-100 h-100 bg-light d-flex justify-content-center align-items-center postDetailAttachment" style={{'position':'absolute', 'top':'0px'}}>
						<Spinner  className="mx-auto" animation="border"  size="md" />
					</div>
				}
				
				
				
			</div>    
			
		 
	);
	
};

export default  memo(StoryDetailFile);
