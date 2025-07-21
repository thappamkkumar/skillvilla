import {useCallback, useState} from "react";  
import ReactPlayer from 'react-player';
import Image from 'react-bootstrap/Image';  
import Spinner from 'react-bootstrap/Spinner';  

const JobApplicationCandidateIntroductionVideo = ({ 
	introductionVideo 
	
	}) => {
	
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
		< >
			 <h4 className="m-0 p-0">Introduction</h4>
			  <hr className="border-3 border-danger mt-2 mb-4" style={{ width: '7rem' }} />
				<div  className="   	"  style={{maxWidth:'600px'}}>
					{ 
						!error ? 
						(
							<div className="w-100 mx-auto  postDetailAttachment">
								<ReactPlayer 
								url={introductionVideo}
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
							<Image src="/images/imageError.jpg" onError={()=>{console.log('error occure while loading image')} } id={`errorImage `} alt="Video is not fount of post " className="postDetailAttachment"   fluid />
						)
					}
		
					{loading &&
						<div className="w-100 h-100 bg-light d-flex justify-content-center align-items-center postDetailAttachment" style={{'position':'absolute', 'top':'0px'}}>
							<Spinner  className="mx-auto" animation="border"  size="md" />
						</div>
					}
				</div>
		</>
  );
};

export default JobApplicationCandidateIntroductionVideo;
