import  { useState, useCallback, memo } from "react";
import ReactPlayer from "react-player";
import Image from 'react-bootstrap/Image';  
 
const WorkfolioVideo = ({ videoName }) => {
  const [loading, setLoading] = useState(true);//state for store data is loading 
	const [error, setError] = useState(false);//state for error
  
   //handle loader if data is loading
	const setLoad = useCallback(() => { 
    setLoading(false); 
  },[]);
	  
	//handle loader if data is loading
	const handleError = useCallback(() => {  
    setError(true); 
  },[]);
	  
  return (
    
		<div   >
			<h4>Video  </h4>
			<div className="mx-auto pt-2" style={{'width':'100%', 'maxWidth':'700px'}} >
		
				<div className="  postDetailAttachmentContainer">
				{(error == false) ? 
						(
							<div className="w-100  postDetailAttachment">
								<ReactPlayer 
									url={videoName}
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
							<Image src="/images/imageError.jpg" onError={()=>{console.log('error occure while loading image')} } id={`errorImage${videoName}`} alt="Error image " className="postDetailAttachment"   fluid />
						)
				}
					 
				</div>
			</div>
    </div>
  );
};

export default memo(WorkfolioVideo);
