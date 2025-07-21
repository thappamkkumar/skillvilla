 

import   {memo, useState, useCallback, useEffect } from 'react';   
 
import Button from 'react-bootstrap/Button';  
import Offcanvas from 'react-bootstrap/Offcanvas';
import ReactPlayer from 'react-player';
import Spinner from 'react-bootstrap/Spinner';
import {  BsX } from 'react-icons/bs';
 

  
const AddWorkFormWatchVideo = ({ watchVideo, setWatchVideo, video}) => {
   
  const [watchVideoUrl, setWatchVideoUrl] = useState(null);
  const [loading, setLoading] = useState(true); // Updated initial value
   
	useEffect(()=>{
		if(video == null)
		{
			return;
		} 
    setWatchVideoUrl(URL.createObjectURL(video));  
	}, [video]);
	
	 

	//handle file load animation
	const setLoad = useCallback(() => {
		setLoading(false);
	}, []);
	
	//handle  watch video
	const handleWatchVideo = () =>
	{
		 setWatchVideo(false);
	} 
		
		 
		
	return ( 
		<Offcanvas
				placement="bottom"
				show={watchVideo}
				onHide={handleWatchVideo}
				className="bg-white rounded-top   mx-auto overflow-hidden"
				style={{width:'100%', maxWidth:'800px', height:'96vh'  }}
		>
				<Offcanvas.Header className="bg-white d-flex flex-wrap justify-content-between">
						<Offcanvas.Title>Selected Files</Offcanvas.Title>
						<Button
								 variant="outline-dark" className=" p-1   border border-2 border-dark " 
								 onClick={handleWatchVideo}
								id="closeShowVideoAttachmentBTn"
								title="Close Video Preview"
						>
								<BsX className=" fw-bold fs-3" />
						</Button>
				</Offcanvas.Header>
				
				
				<Offcanvas.Body className="p-0 m-0">
						{watchVideoUrl != null  && (
							<div className="postDetailAttachmentContainer bg-light">
									<div className="masonry-item">
											 	<ReactPlayer
														url={watchVideoUrl}
														loop={false}
														width="100%"
														height="100%"
														playing={false}
														controls={true}
														className="postDetailAttachment"
														onReady={setLoad}
												/>
											 
									</div>

									 
									{loading && (
											<div
													className="w-100 h-100 bg-light d-flex justify-content-center align-items-center postDetailAttachment"
													style={{ position: 'absolute', top: '0px' }}
											>
													<Spinner className="mx-auto" animation="border" size="md" />
											</div>
									)}
							</div>
					)}
				</Offcanvas.Body>
				
				
				
				
				
		</Offcanvas>
	);
	
};

export default memo(AddWorkFormWatchVideo);
