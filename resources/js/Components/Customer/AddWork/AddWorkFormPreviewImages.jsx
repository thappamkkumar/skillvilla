 

import   {memo, useState, useCallback, useEffect } from 'react';   
 
import Button from 'react-bootstrap/Button';  
import Offcanvas from 'react-bootstrap/Offcanvas';
import Image from 'react-bootstrap/Image';
import Spinner from 'react-bootstrap/Spinner';
import { BsChevronCompactLeft, BsChevronCompactRight, BsX } from 'react-icons/bs';
 

  
const AddWorkFormPreviewImages = ({ previewImages, setPreviewImages, images}) => {
  const [index, setIndex] = useState(0);
  const [previewImagesUrl, setPreviewImagesUrl] = useState([]);
  const [loading, setLoading] = useState(true); // Updated initial value
   
	useEffect(()=>{
		if(images == null)
		{
			return;
		}
		let filePreviews = [];
		filePreviews = images.map((file) => {
			return {
						preview: URL.createObjectURL(file)
				};
		});
    setPreviewImagesUrl(filePreviews);  
	}, [images]);
	
	//handle slide change
	const changeSlide = (direction) => {
		setIndex((prevIndex) => {
				if (direction === 'prev') {
						return Math.max(prevIndex - 1, 0);
				} else {
						return Math.min(prevIndex + 1, previewImagesUrl.length - 1);
				}
		});
	};

	//handle file load animation
	const setLoad = useCallback(() => {
		setLoading(false);
	}, []);
	
	//handle  preview mages
	const handlePreviewImages = () =>
	{
		 setPreviewImages(false);
	} 
		
		 
		
	return ( 
		<Offcanvas
				placement="bottom"
				show={previewImages}
				onHide={handlePreviewImages}
				className="bg-white rounded comment_box_main_Container mx-auto h-100"
		>
				<Offcanvas.Header className="bg-white d-flex flex-wrap justify-content-between">
						<Offcanvas.Title>Selected Files</Offcanvas.Title>
						<Button
								 variant="outline-dark" className=" p-1   border border-2 border-dark  " 
								 onClick={handlePreviewImages}
								id="closeShowImageAttachmentBTn"
								title="Close Image Preview"
						>
								<BsX className=" fw-bold fs-3" />
						</Button>
				</Offcanvas.Header>
				
				
				<Offcanvas.Body className="p-0 m-0">
						{previewImagesUrl != null && previewImagesUrl.length > 0 && (
							<div className="postDetailAttachmentContainer bg-light">
									<div className="">
											 	<Image
															src={previewImagesUrl[index].preview}
															alt={`Selected file ${index}`}
															className="postDetailAttachment"
															onLoad={setLoad}
													/>
											 
									</div>

									{index > 0 && (
											<Button
													variant="*"
													onClick={() => changeSlide('prev')}
													className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"
													id="postDetailVideoController-PrevBtn"
													title="Previous Image"
											>
													<BsChevronCompactLeft style={{ strokeWidth: '1' }} />
											</Button>
									)}
									{index < previewImagesUrl.length - 1 && (
											<Button
													variant="*"
													onClick={() => changeSlide('next')}
													className="fs-3 py-3 px-1 mx-2 postDetailVideoControllerBtn"
													id="postDetailVideoController-NextBtn"
													title="Next Image"
											>
													<BsChevronCompactRight style={{ strokeWidth: '1' }} />
											</Button>
									)}
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

export default memo(AddWorkFormPreviewImages);
