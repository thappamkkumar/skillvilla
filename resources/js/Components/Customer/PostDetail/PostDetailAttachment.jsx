import react, {memo, useState, useEffect, useCallback} from 'react';
//import {useSelector } from 'react-redux'; 
import ReactPlayer from 'react-player';
import Image from 'react-bootstrap/Image';  
import Spinner from 'react-bootstrap/Spinner';  

import handleImageError from '../../../CustomHook/handleImageError'; 
 
const PostDetailAttachment = ({ index, attachment}) =>
{ 
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
	  
	  
	 return(
			<>
				{attachment?.file_type === 'mp4' ? 
					(
						!error ? 
						(
							<div className="w-100  postDetailAttachment">
								<ReactPlayer 
									url={attachment?.file_url}
									loop={false}
									width="100%"
									height="100%"
									playing={false}
									controls={true} 
									onReady={setLoad}
									onError={()=>{handleError(); setLoad();} }
									config={{
										file: {
											attributes: {
												controlsList: "nodownload", // This disables the download button
											},
										},
									}}
								/>
							</div>
						):(
							<Image src="/images/imageError.jpg" onError={()=>{console.log('error occure while loading image')} } id={`errorImage ${index}`} alt="Video is not fount of post " className="postDetailAttachment"   fluid />
						)
						
					):(
						<Image src={attachment?.file_url || '/images/imageError.jpg'} onError={()=>{handleImageError(event, '/images/imageError.jpg'); setLoad();} } id={`postImage ${index}`} alt={`post image ${index}`}className="postDetailAttachment" onLoad={setLoad} fluid />
					) 
				}
				
				{loading &&
					<div className="w-100 h-100 bg-light d-flex justify-content-center align-items-center postDetailAttachment" style={{'position':'absolute', 'top':'0px'}}>
						<Spinner  className="mx-auto" animation="border"  size="md" />
					</div>
				}
			</>
	 );
};

export default memo(PostDetailAttachment);