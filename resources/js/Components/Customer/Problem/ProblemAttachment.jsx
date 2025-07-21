import { useState,useEffect, useCallback, memo} from "react";   
import {useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';  
import Button from 'react-bootstrap/Button';  
import Spinner from 'react-bootstrap/Spinner';  
 import { BsDownload    } from "react-icons/bs";
import ImageViewBox from '../../Common/ImageViewBox';

import downloadFile from '../../../CustomHook/downloadFile';
import handleImageError from '../../../CustomHook/handleImageError'; 

const ProblemAttachment = ({id, attachment, heading, component}) => {
 	const authToken = useSelector((state) => state.auth.token); //selecting token from store
	const [loading, setLoading] = useState(false);
	const [checkFileImage, setCheckFileImage] = useState(false);
	const [viewImage, setViewImage] = useState({viewImage:false, image:null,});
	//const [attachmentFileURL, setAttachmentFileURL] = useState('');
 
	
	useEffect(()=>{
	 	const extension = attachment.split('.').pop(); 
		if (["jpg", "jpeg", "png"].includes(extension.toLowerCase())) {
				setCheckFileImage(true); 
		} else {
				setCheckFileImage(false);;
		}
	/*	let url = null;
		if(component == 'problemDetail')
		{
			url = `/problem_attachment/${attachment}`;
		}
		if(component == 'problemSolution')
		{
			url = `/problem_solution_attachment/${attachment}`;
		}
		if(component == 'workfolioOther')
		{
			url = `/workfolio_otherfile/${attachment}`;
		} 
		setAttachmentFileURL(url); */
	},[attachment]);
	
	//handle  file download
	const handleDownloadFile = useCallback(async()=>{ 
		try
		{ 
	 
			setLoading(true);
			if(id == null)
			{
				return;
			} 
			
			let url = null;
			if(component == 'problemDetail')
			{
				url = `/download-problem-attachment`;
			}
			if(component == 'problemSolution')
			{
				url = `/download-problem-solution-attachment`;
			}
			if(component == 'workfolioOther')
			{
				url = `/download-workfolio-other-file`;
			}
			await downloadFile(id, attachment, url, authToken);  
			   
			 setLoading(false);
		}
		catch(error)
		{
			console.log(error);
			setLoading(false);
		}
	}, [id, authToken, attachment]);
	
	
	
	//Handle  image view
	const handleImageView = useCallback((image) =>
	{
		setViewImage({viewImage:true, image:image,});
	},[]);
	//Handle hide image view
	const handleHideImageView = useCallback((image) =>
	{
		//setViewImage({viewImage:false, image:null,});
			setViewImage(prev => ({...prev, viewImage:false }));
	},[]);
	
  return (
    
		< >
			<ImageViewBox viewImage={viewImage} handleHideImageView={handleHideImageView} />
			
			<h4 >{heading}  </h4>
			<div className=" ">
				{	(checkFileImage == true)&&(
						
					<div className=" pb-4 masonry">
			 
						<div className="masonry-item"   style={{ position: 'relative', cursor:'pointer'}} 
						onClick={()=>{handleImageView(attachment);}}>
						 
								<Image
									src={attachment || '/images/imageError.jpg'}
									alt={`problem-"${id}", attachment-"${attachment}".`}
									className="masonry-image"
									onError={()=>{handleImageError(event, '/images/imageError.jpg')} }
									 
								/>
								 
							 
						
						</div>
					</div>
				) }
				<Button variant="danger"   title="Download File" id={`downloadFileBTN${id}`}  onClick={handleDownloadFile} disabled={loading}>
					{
						loading ? <Spinner size="sm"/> :<BsDownload />
					} 
					<span className="ps-2"> Download </span>
				</Button>
				
			
				 
			</div>
			
			 
		
			
    </>
  );
};

export default memo(ProblemAttachment);
