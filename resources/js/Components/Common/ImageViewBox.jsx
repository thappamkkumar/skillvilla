
import  Offcanvas  from 'react-bootstrap/Offcanvas'; 
 import Button from 'react-bootstrap/Button';
import {   BsX } from 'react-icons/bs';
import handleImageError from '../../CustomHook/handleImageError';
 
const ImageViewBox = ({ 
	viewImage,
	handleHideImageView, 
	 
	}) => {
	 
  
  return (
	
		<Offcanvas
				placement="bottom"
				show={viewImage.viewImage}
				onHide={handleHideImageView}
				className="bg-white rounded-top   mx-auto overflow-hidden"
				style={{width:'100%', maxWidth:'800px', height:'96vh'  }}
		>
				<Offcanvas.Header className="bg-white d-flex flex-wrap justify-content-between">
						<Offcanvas.Title>Selected Image</Offcanvas.Title>
						<Button
								 variant="outline-dark" className=" p-1  border border-2 border-dark " 
								 onClick={handleHideImageView}
								id="closeShowImageAttachmentBTn"
								title="Close Preview"
						>
								<BsX className=" fw-bold fs-3" />
						</Button>
				</Offcanvas.Header>
				
				
				<Offcanvas.Body className="p-0 m-0">
						 	<div className="  bg-light">
									 	 	<img
															src={viewImage.image || '/images/imageError.jpg'}
															alt={`Selected workfolio image  `}
															className="d-block w-100 h-100"
														 onError={()=>{handleImageError(event, '/images/imageError.jpg')} }
							
													/>
									 
									 
							</div>
					 
				</Offcanvas.Body>
		</Offcanvas>
		
	 
  );
};

export default ImageViewBox;
